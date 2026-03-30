import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_name: str = os.getenv("APP_NAME", "SyncWise API")
    app_env: str = os.getenv("APP_ENV", "development")
    frontend_urls_raw: str = os.getenv(
        "FRONTEND_URLS", "http://localhost:5173,http://127.0.0.1:5173"
    )

    @property
    def frontend_urls(self) -> List[str]:
        return [url.strip() for url in self.frontend_urls_raw.split(",") if url.strip()]


settings = Settings()
