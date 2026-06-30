"""
Model Prediction Utilities
Handles model loading and prediction operations
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from typing import Dict, List, Tuple
import time


class TomatoDiseasePredictor:
    """
    Tomato Disease Prediction Model Handler
    """
    
    def __init__(self, model_path: str):
        """
        Initialize the predictor with model path
        
        Args:
            model_path: Path to the trained model file (.h5)
        """
        self.model_path = model_path
        self.model = None
        self.class_names = [
            'Bacterial_spot',
            'Early_blight',
            'healthy',
            'Late_blight',
            'Leaf_Mold',
            'powdery_mildew',
            'Septoria_leaf_spot',
            'Spider_mites Two-spotted_spider_mite',
            'Target_Spot',
            'Tomato_mosaic_virus',
            'Tomato_Yellow_Leaf_Curl_Virus'
        ]
        self.num_classes = len(self.class_names)
    
    def load_model(self):
        """Load the trained model"""
        import os
        if not os.path.exists(self.model_path):
            print(f"❌ Model file not found at {self.model_path}")
            return False
        try:
            # Try loading without recompiling first (handles cross-version compatibility)
            self.model = keras.models.load_model(
                self.model_path,
                compile=False
            )
            # Recompile with basic settings
            self.model.compile(
                optimizer='adam',
                loss='sparse_categorical_crossentropy',
                metrics=['accuracy']
            )
            print(f"✅ Model loaded successfully from {self.model_path}")
            return True
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            return False
    
    def predict(self, image_array: np.ndarray) -> Dict:
        """
        Make prediction on preprocessed image
        
        Args:
            image_array: Preprocessed image array
            
        Returns:
            Dictionary containing prediction results
        """
        if self.model is None:
            raise ValueError("Model not loaded. Call load_model() first.")
        
        # Start timing
        start_time = time.time()
        
        # Make prediction
        predictions = self.model.predict(image_array, verbose=0)
        
        # Calculate inference time
        inference_time = time.time() - start_time
        
        # Get predicted class
        predicted_class_idx = np.argmax(predictions[0])
        predicted_class = self.class_names[predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx])
        
        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "confidence_percentage": confidence * 100,
            "all_probabilities": predictions[0].tolist(),
            "inference_time": inference_time
        }
    
    def get_top_n_predictions(
        self, 
        image_array: np.ndarray, 
        top_n: int = 3
    ) -> List[Dict]:
        """
        Get top N predictions with confidence scores
        
        Args:
            image_array: Preprocessed image array
            top_n: Number of top predictions to return
            
        Returns:
            List of dictionaries containing class names and probabilities
        """
        if self.model is None:
            raise ValueError("Model not loaded. Call load_model() first.")
        
        # Make prediction
        predictions = self.model.predict(image_array, verbose=0)
        
        # Get top N indices
        top_indices = np.argsort(predictions[0])[::-1][:top_n]
        
        # Create result list
        top_predictions = []
        for idx in top_indices:
            top_predictions.append({
                "disease": self.class_names[idx],
                "probability": float(predictions[0][idx]),
                "percentage": float(predictions[0][idx]) * 100
            })
        
        return top_predictions
    
    def get_model_info(self) -> Dict:
        """
        Get information about the loaded model
        
        Returns:
            Dictionary containing model information
        """
        if self.model is None:
            return {"error": "Model not loaded"}
        
        try:
            # Get model size in MB
            import os
            model_size_mb = os.path.getsize(self.model_path) / (1024 * 1024)
            
            return {
                "model_name": "EfficientNetB0",
                "num_classes": self.num_classes,
                "input_shape": (224, 224, 3),
                "model_size_mb": round(model_size_mb, 2),
                "total_params": self.model.count_params() if hasattr(self.model, 'count_params') else "N/A"
            }
        except Exception as e:
            return {"error": str(e)}
