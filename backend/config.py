from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl


class Settings(BaseSettings):
    frontend_url: AnyHttpUrl = "http://localhost:5173"
    model_folder: Path = Path("models")
    model_filename: str = "best_model.h5"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
