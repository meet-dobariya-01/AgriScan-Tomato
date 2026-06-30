"""
Grad-CAM Visualization
Generates Class Activation Mapping to visualize model predictions
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
import cv2
from PIL import Image
from typing import Tuple


class GradCAM:
    """
    Gradient-weighted Class Activation Mapping (Grad-CAM)
    Visualizes which parts of the image the model focuses on
    """

    def __init__(self, model, layer_name: str = None):
        self.model = model

        if layer_name is None:
            layer_name = self._find_last_conv_layer(model)

        self.layer_name = layer_name
        self.grad_model = self._build_grad_model()

    def _find_last_conv_layer(self, model):
        """Find the last conv layer, searching inside sub-models too (Keras 3)"""
        # First try top-level layers
        for layer in reversed(model.layers):
            if 'conv' in layer.name.lower():
                return layer.name

        # Search inside sub-models (EfficientNet is wrapped in Keras 3)
        for layer in reversed(model.layers):
            if hasattr(layer, 'layers'):
                for sub_layer in reversed(layer.layers):
                    if 'conv' in sub_layer.name.lower():
                        return sub_layer.name

        # Known fallbacks for EfficientNetB0
        for name in ["top_conv", "block7a_project_conv", "stem_conv"]:
            try:
                model.get_layer(name)
                return name
            except Exception:
                continue

        return None

    def _build_grad_model(self):
        """Build gradient model for Grad-CAM"""
        if self.layer_name is None:
            return None
        try:
            target_layer = self.model.get_layer(self.layer_name)
            grad_model = keras.models.Model(
                inputs=[self.model.input],
                outputs=[target_layer.output, self.model.output]
            )
            return grad_model
        except Exception as e:
            print(f"Grad-CAM model build failed: {e}")
            return None

    def generate_heatmap(self, image_array: np.ndarray, pred_index: int = None) -> np.ndarray:
        if self.grad_model is None:
            return np.zeros((7, 7))

        try:
            image_tensor = tf.cast(image_array, tf.float32)

            with tf.GradientTape() as tape:
                conv_outputs, predictions = self.grad_model(image_tensor, training=False)
                tape.watch(conv_outputs)

                if pred_index is None:
                    pred_index = int(tf.argmax(predictions[0]))

                class_channel = predictions[:, pred_index]

            grads = tape.gradient(class_channel, conv_outputs)

            if grads is None:
                return np.zeros((7, 7))

            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
            conv_out = conv_outputs[0]
            heatmap = conv_out @ pooled_grads[..., tf.newaxis]
            heatmap = tf.squeeze(heatmap)

            # ReLU + normalize
            heatmap = tf.maximum(heatmap, 0).numpy()
            max_val = heatmap.max()
            if max_val > 0:
                heatmap = heatmap / max_val

            return heatmap

        except Exception as e:
            print(f"Heatmap generation error: {e}")
            return np.zeros((7, 7))

    def overlay_heatmap(
        self,
        heatmap: np.ndarray,
        original_image: Image.Image,
        alpha: float = 0.5,
        colormap: int = cv2.COLORMAP_JET
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        try:
            heatmap_resized = cv2.resize(heatmap, (224, 224))
            heatmap_uint8 = np.uint8(255 * heatmap_resized)
            heatmap_colored = cv2.applyColorMap(heatmap_uint8, colormap)
            heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

            original_resized = original_image.convert("RGB").resize((224, 224))
            original_array = np.array(original_resized)

            superimposed = cv2.addWeighted(original_array, 1 - alpha, heatmap_colored, alpha, 0)

            return heatmap_colored, original_array, superimposed

        except Exception as e:
            print(f"Overlay error: {e}")
            default = np.zeros((224, 224, 3), dtype=np.uint8)
            return default, default, default

    def generate_gradcam(
        self,
        image_array: np.ndarray,
        original_image: Image.Image,
        pred_index: int = None,
        alpha: float = 0.5
    ) -> dict:
        heatmap = self.generate_heatmap(image_array, pred_index)
        heatmap_colored, original_array, superimposed = self.overlay_heatmap(
            heatmap, original_image, alpha
        )
        return {
            "heatmap": heatmap_colored,
            "original": original_array,
            "superimposed": superimposed
        }
