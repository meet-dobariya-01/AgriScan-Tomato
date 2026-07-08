from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from starlette.concurrency import run_in_threadpool
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from typing import List

from backend.schemas.responses import (
    HealthResponse,
    PredictResponse,
    GradCAMResponse,
    DiseaseInfoResponse,
    ModelInfoResponse,
)

router = APIRouter(prefix="/api/v1", tags=["Tomato Disease Classifier"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png"}


def _validate_image_type(filename: str, content_type: str) -> bool:
    return (
        content_type.lower() in ALLOWED_IMAGE_TYPES
        or filename.lower().endswith((".jpg", ".jpeg", ".png"))
    )


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", message="Tomato Disease Classification API is healthy.")


@router.post("/predict", response_model=PredictResponse)
async def predict_image(request: Request, file: UploadFile = File(...)) -> PredictResponse:
    if not _validate_image_type(file.filename, file.content_type or ""):
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Unsupported file type. Use JPG or PNG images.")

    payload = await file.read()
    service = request.app.state.inference_service

    is_valid = await run_in_threadpool(service.validate_image_bytes, payload)
    if not is_valid:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Invalid image file or corrupted upload.")

    prediction = await run_in_threadpool(service.predict_image, payload)
    return PredictResponse(**prediction)


@router.post("/gradcam", response_model=GradCAMResponse)
async def gradcam_image(request: Request, file: UploadFile = File(...)) -> GradCAMResponse:
    if not _validate_image_type(file.filename, file.content_type or ""):
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Unsupported file type. Use JPG or PNG images.")

    payload = await file.read()
    service = request.app.state.inference_service

    is_valid = await run_in_threadpool(service.validate_image_bytes, payload)
    if not is_valid:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Invalid image file or corrupted upload.")

    gradcam_payload = await run_in_threadpool(service.generate_gradcam_response, payload)
    return GradCAMResponse(**gradcam_payload)


@router.get("/disease/{name}", response_model=DiseaseInfoResponse)
async def get_disease_details(request: Request, name: str) -> DiseaseInfoResponse:
    service = request.app.state.inference_service
    disease_info = await run_in_threadpool(service.get_disease_info, name)

    if disease_info is None:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=f"Disease information not found for '{name}'.")

    return DiseaseInfoResponse(**disease_info)


@router.get("/model", response_model=ModelInfoResponse)
async def get_model_metadata(request: Request) -> ModelInfoResponse:
    service = request.app.state.inference_service
    metadata = await run_in_threadpool(service.get_model_metadata)
    return ModelInfoResponse(**metadata)
