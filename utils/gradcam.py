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

    def __init__(self, model):
        """
        Initialize Grad-CAM for Nested Sequential Models
        """
        self.model = model
        
        # 1. Target the base model directly
        self.base_model = self.model.layers[0]
        
        # Fallback to known EfficientNetB0 last conv layer
        self.layer_name = "top_conv" 
        
        # 2. Build the grad model strictly for the base model
        self.grad_model = self._build_grad_model()

    def _build_grad_model(self):
        """Build gradient model targeting ONLY the base model"""
        try:
            target_layer = self.base_model.get_layer(self.layer_name)
            grad_model = keras.models.Model(
                inputs=[self.base_model.input],
                outputs=[target_layer.output, self.base_model.output]
            )
            return grad_model
        except Exception as e:
            print(f"Error building grad model: {str(e)}")
            return None

    def generate_heatmap(
        self,
        image_array: np.ndarray,
        pred_index: int = None
    ) -> np.ndarray:
        """Generate Grad-CAM heatmap using nested iteration"""
        if self.grad_model is None:
            return np.zeros((224, 224))

        try:
            with tf.GradientTape() as tape:
                # 3. Get the feature maps and the base model's output
                conv_outputs, base_output = self.grad_model(image_array)

                # 4. Pass the base output through your custom top layers manually
                x = base_output
                for layer in self.model.layers[1:]:
                    # Set training=False so Dropout behaves like it's in inference mode
                    x = layer(x, training=False)
                
                predictions = x

                # If no pred_index specified, use the top prediction
                if pred_index is None:
                    pred_index = tf.argmax(predictions[0])

                # Get the score for the predicted class
                class_channel = predictions[:, pred_index]

            # Compute gradients of the class score with respect to conv layer output
            grads = tape.gradient(class_channel, conv_outputs)

            # Compute the guided gradients
            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

            # Multiply each channel by its importance weight
            conv_outputs = conv_outputs[0]
            
            # Use matrix multiplication / sum to weight the features
            heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)

            # Apply ReLU to keep only features that have a positive influence
            heatmap = tf.maximum(heatmap, 0)
            
            # FIX: Add a tiny epsilon (1e-10) to prevent a division by zero error 
            heatmap /= (tf.reduce_max(heatmap) + 1e-10)
            
            return heatmap.numpy()

        except Exception as e:
            print(f"Error generating heatmap: {str(e)}")
            return np.zeros((7, 7))

    def overlay_heatmap(
        self,
        heatmap: np.ndarray,
        original_image: Image.Image,
        alpha: float = 0.4,
        colormap: int = cv2.COLORMAP_JET
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """Overlay heatmap on original image"""
        try:
            heatmap_resized = cv2.resize(heatmap, (224, 224))
            heatmap_colored = np.uint8(255 * heatmap_resized)
            heatmap_colored = cv2.applyColorMap(heatmap_colored, colormap)
            heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

            original_resized = original_image.resize((224, 224))
            original_array = np.array(original_resized)

            superimposed = cv2.addWeighted(
                original_array,
                1 - alpha,
                heatmap_colored,
                alpha,
                0
            )

            return heatmap_colored, original_array, superimposed

        except Exception as e:
            print(f"Error overlaying heatmap: {str(e)}")
            default = np.zeros((224, 224, 3), dtype=np.uint8)
            return default, default, default

    def generate_gradcam(
        self,
        image_array: np.ndarray,
        original_image: Image.Image,
        pred_index: int = None,
        alpha: float = 0.4
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