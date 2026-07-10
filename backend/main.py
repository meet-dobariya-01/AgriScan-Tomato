import os
import logging
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.api.routes import router as api_router
from backend.config import Settings
from backend.services.inference_service import InferenceService

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
settings = Settings()
def create_app() -> FastAPI:
    app = FastAPI(
        title="Tomato Disease Classification API",
        description="FastAPI backend for tomato leaf disease prediction and Grad-CAM explainability.",
        version="1.0.0",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(settings.frontend_url),
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://10.200.4.241:5173",
             "https://atliq-agriculture.vercel.app",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router)
    @app.get("/")
    async def root():
        return {
            "message": "Tomato Disease Classification API is running successfully "
        }
    @app.on_event("startup")
    async def startup_event() -> None:
        model_path = Path(__file__).resolve().parent / settings.model_folder / settings.model_filename
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found at '{model_path}'")
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
        )
        logging.getLogger("tensorflow").setLevel(logging.ERROR)
        logging.getLogger("absl").setLevel(logging.ERROR)
        app.state.logger = logging.getLogger("tomato_api")
        app.state.logger.info("Loading model...")
        app.state.inference_service = InferenceService(str(model_path))
        app.state.logger.info("Model loaded successfully.")
        app.state.logger.info("Tomato Disease Classification API initialized.")
    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logging.exception("Unhandled exception occurred")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error. Please try again later."},
        )
    return app
app = create_app()
