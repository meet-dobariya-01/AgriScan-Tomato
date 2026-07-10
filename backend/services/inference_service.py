import base64
import io
import os
import time
from typing import Any, Dict, List, Optional

import numpy as np
from PIL import Image
from tensorflow import keras

from backend.app.utils.preprocessing import load_and_preprocess_image, validate_image
from backend.app.utils.predict import TomatoDiseasePredictor
from backend.app.utils.gradcam import GradCAM
from backend.app.utils.disease_info import DISEASE_INFO


class InferenceService:
    """Inference service encapsulating model loading, prediction, and Grad-CAM logic."""

    def __init__(self, model_path: str):
        self.model_path = model_path
        self.predictor = TomatoDiseasePredictor(self.model_path)
        self.model = None
        self.gradcam = None
        self._load_model()

    def _load_model(self) -> None:
        print("===== STEP 1 =====")

        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at '{self.model_path}'")
        print("===== STEP 2 =====")

        self.predictor.load_model()
        if self.predictor.model is None:
            raise RuntimeError("Failed to load the Keras model.")
        print("===== STEP 3 =====")

        self.model = self.predictor.model
        print("===== STEP 4 =====")

        self.gradcam = GradCAM(self.model)
        print("===== STEP 5 =====")

    def validate_image_bytes(self, payload: bytes) -> bool:
        try:
            image_file = io.BytesIO(payload)
            return validate_image(image_file)
        except Exception:
            return False

    def predict_image(self, payload: bytes) -> Dict[str, Any]:
        image_file = io.BytesIO(payload)
        preprocessed = load_and_preprocess_image(image_file)
        result = self.predictor.predict(preprocessed)
        top_predictions = self.predictor.get_top_n_predictions(preprocessed, top_n=3)

        return {
            "predicted_disease": result["predicted_class"],
            "confidence": result["confidence"],
            "confidence_percentage": result["confidence_percentage"],
            "top_predictions": top_predictions,
            "inference_time": result["inference_time"],
        }

    def generate_gradcam_response(self, payload: bytes) -> Dict[str, Any]:
        image_file = io.BytesIO(payload)
        original_image = Image.open(image_file).convert("RGB")
        image_file.seek(0)

        preprocessed = load_and_preprocess_image(image_file)
        result = self.predictor.predict(preprocessed)
        top_predictions = self.predictor.get_top_n_predictions(preprocessed, top_n=3)

        heatmap_results = self.gradcam.generate_gradcam(preprocessed, original_image)

        return {
            "predicted_disease": result["predicted_class"],
            "confidence": result["confidence"],
            "confidence_percentage": result["confidence_percentage"],
            "top_predictions": top_predictions,
            "inference_time": result["inference_time"],
            "original_image": self._image_to_base64(original_image),
            "heatmap_image": self._image_to_base64(Image.fromarray(heatmap_results["heatmap"])),
            "overlay_image": self._image_to_base64(Image.fromarray(heatmap_results["superimposed"])),
        }

    def get_disease_info(self, disease_name: str) -> Optional[Dict[str, Any]]:
        # Robust lookup: accept frontend variants (spaces, underscores, hyphens,
        # different casing, and minor punctuation) and attempt multiple
        # normalization strategies before returning None.
        name = (disease_name or "").strip()
        if not name:
            return None

        # Direct match
        if name in DISEASE_INFO:
            return DISEASE_INFO[name]

        # Try common simple transforms
        candidates = [
            name,
            name.replace(" ", "_"),
            name.replace("-", "_"),
            name.replace(" ", "_").replace("-", "_"),
        ]
        for cand in candidates:
            if cand in DISEASE_INFO:
                return DISEASE_INFO[cand]

        # Case-insensitive match and underscore/space equivalence
        lower = name.lower()
        for key in DISEASE_INFO.keys():
            if key.lower() == lower:
                return DISEASE_INFO[key]
            if key.lower().replace("_", " ") == lower:
                return DISEASE_INFO[key]

        # Alphanumeric normalization (remove non-alnum characters) and compare
        def _norm(s: str) -> str:
            return "".join(ch.lower() for ch in s if ch.isalnum())

        n_norm = _norm(name)
        for key in DISEASE_INFO.keys():
            if _norm(key) == n_norm:
                return DISEASE_INFO[key]

        return None

    def get_model_metadata(self) -> Dict[str, Any]:
        model_info = self.predictor.get_model_info()
        return {
            "model_name": model_info.get("model_name", "EfficientNetB0"),
            "input_shape": model_info.get("input_shape", (224, 224, 3)),
            "num_classes": model_info.get("num_classes", 11),
            "model_size_mb": model_info.get("model_size_mb", 0.0),
            "total_params": model_info.get("total_params", None),
        }

    @staticmethod
    def _image_to_base64(image: Image.Image) -> str:
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{encoded}"
