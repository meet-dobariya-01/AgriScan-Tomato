from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Tuple, Any


class HealthResponse(BaseModel):
    status: str
    message: str


class PredictionItem(BaseModel):
    disease: str
    probability: float
    percentage: float


class PredictResponse(BaseModel):
    predicted_disease: str
    confidence: float
    confidence_percentage: float
    top_predictions: List[PredictionItem]
    inference_time: float


class DiseaseInfoResponse(BaseModel):
    name: str
    scientific_name: str
    description: str
    symptoms: List[str]
    causes: List[str]
    treatment: List[str]
    prevention: List[str]
    severity: str


class ModelInfoResponse(BaseModel):
    model_name: str
    input_shape: Tuple[int, int, int]
    num_classes: int
    model_size_mb: float
    total_params: Optional[int]
