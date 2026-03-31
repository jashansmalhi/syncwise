import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

load_dotenv()


DEFAULT_ARTIFACT_DIR = Path(__file__).resolve().parents[2] / "artifacts"


class Settings:
    def __init__(self) -> None:
        self.app_name = os.getenv("APP_NAME", "SyncWise API")
        self.app_env = os.getenv("APP_ENV", "development")
        self.frontend_urls_raw = os.getenv(
            "FRONTEND_URLS", "http://localhost:5173,http://127.0.0.1:5173"
        )
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY", "")
        self.model_artifact_dir = os.getenv("MODEL_ARTIFACT_DIR", str(DEFAULT_ARTIFACT_DIR))

    @property
    def frontend_urls(self) -> List[str]:
        return [url.strip() for url in self.frontend_urls_raw.split(",") if url.strip()]

    @property
    def model_artifact_path(self) -> Path:
        return Path(self.model_artifact_dir)


settings = Settings()
