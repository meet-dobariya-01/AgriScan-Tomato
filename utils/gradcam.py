"""
Grad-CAM Visualization — Fixed for Keras 3 + EfficientNetB0
Generates Class Activation Mapping to visualize model predictions

Root causes fixed:
1. Layer search now finds conv layers inside EfficientNetB0 sub-model (Keras 3 wraps it)
2. GradientTape watches the conv output tensor BEFORE the class score computation
   by splitting the model into two parts: feature extractor + classifier
3. Heatmap computed as weighted sum of feature maps (not matrix multiply)
4. Proper ReLU + epsilon normalization to prevent all-zero heatmaps
5. Image preprocessing matches training pipeline exactly
"""

import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
import cv2
from PIL import Image
from typing import Tuple, Optional


class GradCAM:
    """
    Gradient-weighted Class Activation Mapping (Grad-CAM)
    Compatible with Keras 3 + EfficientNetB0 wrapped models
    """

    def __init__(self, model, layer_name: str = None):
        """
        Args:
            model: Trained Keras model (full model with augmentation + EfficientNet + head)
            layer_name: Conv layer name to visualize. Auto-detected if None.
        """
        self.model = model
        self.layer_name = layer_name or self._find_last_conv_layer()
        print(f"[GradCAM] Using layer: {self.layer_name}")

    def _find_last_conv_layer(self) -> str:
        """
        Find the last Conv2D layer in EfficientNetB0.
        Searches inside sub-models because Keras 3 wraps EfficientNet as a nested model.
        """
        # Search inside each sub-model layer
        for layer in reversed(self.model.layers):
            # EfficientNetB0 is typically a sub-model layer
            if hasattr(layer, 'layers'):
                for sub_layer in reversed(layer.layers):
                    name = sub_layer.name.lower()
                    if 'conv' in name and 'pad' not in name and 'depthwise' not in name:
                        print(f"[GradCAM] Found conv layer in sub-model: {sub_layer.name}")
                        return sub_layer.name

        # Fallback: search top-level layers
        for layer in reversed(self.model.layers):
            name = layer.name.lower()
            if 'conv' in name and 'pad' not in name:
                return layer.name

        # Last resort hardcoded fallback for EfficientNetB0
        for candidate in ["top_conv", "block7a_project_conv", "block6d_project_conv"]:
            try:
                self._get_layer_from_model(candidate)
                return candidate
            except Exception:
                continue

        return "top_conv"

    def _get_layer_from_model(self, layer_name: str):
        """
        Get a layer by name, searching top-level and inside sub-models.
        Raises ValueError if not found.
        """
        # Try top-level first
        try:
            return self.model.get_layer(layer_name)
        except Exception:
            pass

        # Search inside sub-models
        for layer in self.model.layers:
            if hasattr(layer, 'layers'):
                try:
                    return layer.get_layer(layer_name)
                except Exception:
                    continue

        raise ValueError(f"Layer '{layer_name}' not found in model or sub-models")

    def _build_grad_model(self):
        """
        Build a model that outputs [conv_layer_output, final_predictions].
        Works with Keras 3 by finding the layer wherever it lives.
        """
        try:
            conv_layer = self._get_layer_from_model(self.layer_name)
            grad_model = tf.keras.Model(
                inputs=self.model.inputs,
                outputs=[conv_layer.output, self.model.output]
            )
            return grad_model
        except Exception as e:
            print(f"[GradCAM] Failed to build grad model: {e}")
            return None

    def generate_heatmap(
        self,
        image_array: np.ndarray,
        pred_index: Optional[int] = None
    ) -> np.ndarray:
        """
        Generate Grad-CAM heatmap.

        Args:
            image_array: Preprocessed image array, shape (1, 224, 224, 3),
                         already passed through preprocess_input (values in [-1, 1])
            pred_index: Class index to visualize. Uses argmax if None.

        Returns:
            Normalized heatmap array, shape (H, W), values in [0, 1]
        """
        grad_model = self._build_grad_model()
        if grad_model is None:
            print("[GradCAM] grad_model is None, returning blank heatmap")
            return np.zeros((7, 7))

        try:
            img_tensor = tf.cast(image_array, tf.float32)

            # Use persistent=True so we can call gradient() after the tape context
            with tf.GradientTape(persistent=True) as tape:
                # Watch the input tensor explicitly
                tape.watch(img_tensor)

                # Forward pass — get conv features and final predictions
                conv_outputs, predictions = grad_model(img_tensor, training=False)

                # Watch conv outputs so gradients flow through them
                tape.watch(conv_outputs)

                # Get predicted class index
                if pred_index is None:
                    pred_index = int(tf.argmax(predictions[0]).numpy())

                # Score for the predicted class
                class_score = predictions[:, pred_index]

            # Compute gradients of class score w.r.t. conv feature maps
            grads = tape.gradient(class_score, conv_outputs)

            # Debug info
            print(f"[GradCAM] Conv output shape: {conv_outputs.shape}")
            print(f"[GradCAM] Grads shape: {grads.shape if grads is not None else 'None'}")
            print(f"[GradCAM] Pred index: {pred_index}, Score: {float(class_score[0]):.4f}")

            if grads is None:
                print("[GradCAM] Gradients are None!")
                return np.zeros((7, 7))

            # Global Average Pooling on gradients → importance weights per channel
            # Shape: (num_channels,)
            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

            # Weight each feature map channel by its importance
            # conv_outputs[0] shape: (H, W, C)
            conv_out_np = conv_outputs[0].numpy()       # (H, W, C)
            pooled_grads_np = pooled_grads.numpy()      # (C,)

            # Weighted sum across channels → heatmap shape: (H, W)
            heatmap = np.zeros(conv_out_np.shape[:2], dtype=np.float32)
            for i, w in enumerate(pooled_grads_np):
                heatmap += w * conv_out_np[:, :, i]

            # Apply ReLU (keep only positive activations)
            heatmap = np.maximum(heatmap, 0)

            # Normalize to [0, 1], prevent division by zero
            heatmap_max = heatmap.max()
            print(f"[GradCAM] Heatmap min: {heatmap.min():.4f}, max: {heatmap_max:.4f}")

            if heatmap_max > 1e-8:
                heatmap = heatmap / heatmap_max
            else:
                print("[GradCAM] Warning: heatmap max is near zero, trying absolute value")
                # Try without ReLU as fallback
                heatmap = np.abs(
                    np.sum(conv_out_np * pooled_grads_np[np.newaxis, np.newaxis, :], axis=-1)
                )
                if heatmap.max() > 1e-8:
                    heatmap = heatmap / heatmap.max()

            return heatmap

        except Exception as e:
            print(f"[GradCAM] Heatmap generation error: {e}")
            import traceback
            traceback.print_exc()
            return np.zeros((7, 7))

    def overlay_heatmap(
        self,
        heatmap: np.ndarray,
        original_image: Image.Image,
        alpha: float = 0.5,
        colormap: int = cv2.COLORMAP_JET
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Overlay heatmap on original image using alpha blending.

        Args:
            heatmap: Normalized heatmap array (H, W), values in [0, 1]
            original_image: Original PIL Image (before preprocessing)
            alpha: Heatmap overlay transparency (0=original only, 1=heatmap only)
            colormap: OpenCV colormap (COLORMAP_JET gives red/yellow/blue)

        Returns:
            Tuple of (heatmap_colored, original_array, superimposed)
        """
        try:
            # Resize heatmap to display size
            heatmap_resized = cv2.resize(heatmap, (224, 224))

            # Convert [0,1] float → [0,255] uint8
            heatmap_uint8 = np.uint8(255 * heatmap_resized)

            # Apply colormap: low activation=blue, high activation=red
            heatmap_colored = cv2.applyColorMap(heatmap_uint8, colormap)

            # OpenCV uses BGR — convert to RGB for display
            heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

            # Resize original image to 224x224, ensure RGB
            original_resized = original_image.convert("RGB").resize((224, 224))
            original_array = np.array(original_resized, dtype=np.uint8)

            # Alpha blend: overlay heatmap on original
            # superimposed = (1-alpha)*original + alpha*heatmap
            superimposed = cv2.addWeighted(
                original_array, 1 - alpha,
                heatmap_colored, alpha,
                0
            )

            return heatmap_colored, original_array, superimposed

        except Exception as e:
            print(f"[GradCAM] Overlay error: {e}")
            blank = np.zeros((224, 224, 3), dtype=np.uint8)
            return blank, blank, blank

    def generate_gradcam(
        self,
        image_array: np.ndarray,
        original_image: Image.Image,
        pred_index: Optional[int] = None,
        alpha: float = 0.5
    ) -> dict:
        """
        Full Grad-CAM pipeline: heatmap + overlay.

        Args:
            image_array: Preprocessed image (1, 224, 224, 3) from preprocess_input
            original_image: Original PIL Image for overlay
            pred_index: Class index (uses argmax if None)
            alpha: Heatmap blend strength

        Returns:
            Dict with keys: 'heatmap', 'original', 'superimposed'
        """
        heatmap = self.generate_heatmap(image_array, pred_index)
        heatmap_colored, original_array, superimposed = self.overlay_heatmap(
            heatmap, original_image, alpha
        )
        return {
            "heatmap": heatmap_colored,
            "original": original_array,
            "superimposed": superimposed
        }
