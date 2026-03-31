import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

load_dotenv()


DEFAULT_ARTIFACT_DIR = Path(__file__).resolve().parents[2] / "artifacts"


class Settings:
    app_name: str = os.getenv("APP_NAME", "SyncWise API")
    app_env: str = os.getenv("APP_ENV", "development")
    frontend_urls_raw: str = os.getenv(
        "FRONTEND_URLS", "http://localhost:5173,http://127.0.0.1:5173"
    )
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    model_artifact_dir: str = os.getenv("MODEL_ARTIFACT_DIR", str(DEFAULT_ARTIFACT_DIR))

    @property
    def frontend_urls(self) -> List[str]:
        return [url.strip() for url in self.frontend_urls_raw.split(",") if url.strip()]

    @property
    def model_artifact_path(self) -> Path:
        return Path(self.model_artifact_dir)


settings = Settings()
