"""
Image Preprocessing Utilities
Handles image loading, resizing, and normalization for model inference
"""

import numpy as np
from PIL import Image
from typing import Tuple
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input


def load_and_preprocess_image(
    image_path_or_file, 
    target_size: Tuple[int, int] = (224, 224)
) -> np.ndarray:
    """
    Load and preprocess an image for model prediction
    
    Args:
        image_path_or_file: Path to image file or file-like object
        target_size: Target size for resizing (width, height)
        
    Returns:
        Preprocessed image array ready for model input
    """
    try:
        # Load image
        if isinstance(image_path_or_file, str):
            img = Image.open(image_path_or_file)
        else:
            img = Image.open(image_path_or_file)
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize image
        img = img.resize(target_size)
        
        # Convert to array
        img_array = np.array(img)
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        # Preprocess using EfficientNet preprocessing
        img_array = preprocess_input(img_array)
        
        return img_array
    
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")


def validate_image(image_file) -> bool:
    """
    Validate if uploaded file is a valid image
    
    Args:
        image_file: Uploaded file object
        
    Returns:
        True if valid image, False otherwise
    """
    try:
        img = Image.open(image_file)
        img.verify()
        return True
    except:
        return False


def get_image_info(image_file) -> dict:
    """
    Get information about the uploaded image
    
    Args:
        image_file: Image file object
        
    Returns:
        Dictionary containing image information
    """
    try:
        img = Image.open(image_file)
        return {
            "format": img.format,
            "mode": img.mode,
            "size": img.size,
            "width": img.width,
            "height": img.height
        }
    except Exception as e:
        return {"error": str(e)}
