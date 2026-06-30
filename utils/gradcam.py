"""
Grad-CAM Visualization
Generates Class Activation Mapping to visualize model predictions
"""

import numpy as np
import os
os.environ["TF_USE_LEGACY_KERAS"] = "1"
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
        """
        Initialize Grad-CAM
        
        Args:
            model: Trained Keras model
            layer_name: Name of the layer to visualize (default: last conv layer)
        """
        self.model = model
        
        # Find the last convolutional layer if not specified
        if layer_name is None:
            for layer in reversed(model.layers):
                if 'conv' in layer.name.lower():
                    layer_name = layer.name
                    break
        
        self.layer_name = layer_name
        self.grad_model = self._build_grad_model()
    
    def _build_grad_model(self):
        """Build gradient model for Grad-CAM"""
        try:
            # Get the target layer
            target_layer = self.model.get_layer(self.layer_name)
            
            # Create a model that maps input to target layer output and final predictions
            grad_model = keras.models.Model(
                inputs=[self.model.input],
                outputs=[target_layer.output, self.model.output]
            )
            return grad_model
        except:
            # If specific layer not found, use a default approach
            return None
    
    def generate_heatmap(
        self, 
        image_array: np.ndarray, 
        pred_index: int = None
    ) -> np.ndarray:
        """
        Generate Grad-CAM heatmap
        
        Args:
            image_array: Preprocessed image array
            pred_index: Index of the class to visualize (default: predicted class)
            
        Returns:
            Heatmap as numpy array
        """
        if self.grad_model is None:
            # Return empty heatmap if grad model creation failed
            return np.zeros((224, 224))
        
        try:
            # Record operations for automatic differentiation
            with tf.GradientTape() as tape:
                # Get conv layer output and predictions
                conv_outputs, predictions = self.grad_model(image_array)
                
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
            heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
            heatmap = tf.squeeze(heatmap)
            
            # Normalize heatmap
            heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
            heatmap = heatmap.numpy()
            
            return heatmap
        
        except Exception as e:
            print(f"Error generating heatmap: {str(e)}")
            return np.zeros((7, 7))  # Return default size heatmap
    
    def overlay_heatmap(
        self, 
        heatmap: np.ndarray, 
        original_image: Image.Image,
        alpha: float = 0.4,
        colormap: int = cv2.COLORMAP_JET
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Overlay heatmap on original image
        
        Args:
            heatmap: Generated heatmap
            original_image: Original PIL Image
            alpha: Transparency of heatmap overlay
            colormap: OpenCV colormap to use
            
        Returns:
            Tuple of (heatmap_colored, original_resized, superimposed)
        """
        try:
            # Resize heatmap to match original image size
            heatmap_resized = cv2.resize(heatmap, (224, 224))
            
            # Convert heatmap to RGB
            heatmap_colored = np.uint8(255 * heatmap_resized)
            heatmap_colored = cv2.applyColorMap(heatmap_colored, colormap)
            heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
            
            # Resize original image
            original_resized = original_image.resize((224, 224))
            original_array = np.array(original_resized)
            
            # Superimpose heatmap on original image
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
            # Return default images
            default = np.zeros((224, 224, 3), dtype=np.uint8)
            return default, default, default
    
    def generate_gradcam(
        self, 
        image_array: np.ndarray,
        original_image: Image.Image,
        pred_index: int = None,
        alpha: float = 0.4
    ) -> dict:
        """
        Generate complete Grad-CAM visualization
        
        Args:
            image_array: Preprocessed image array
            original_image: Original PIL Image
            pred_index: Class index to visualize
            alpha: Overlay transparency
            
        Returns:
            Dictionary containing all visualization components
        """
        # Generate heatmap
        heatmap = self.generate_heatmap(image_array, pred_index)
        
        # Overlay on original image
        heatmap_colored, original_array, superimposed = self.overlay_heatmap(
            heatmap, original_image, alpha
        )
        
        return {
            "heatmap": heatmap_colored,
            "original": original_array,
            "superimposed": superimposed
        }
