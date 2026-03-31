from pathlib import Path

from app.core.config import Settings


def test_settings_expose_local_model_artifact_config(monkeypatch) -> None:
    monkeypatch.delenv("MODEL_ARTIFACT_DIR", raising=False)
    monkeypatch.delenv("OLLAMA_API_KEY", raising=False)
    monkeypatch.delenv("OLLAMA_BASE_URL", raising=False)
    monkeypatch.delenv("OLLAMA_MODEL", raising=False)

    settings = Settings()

    assert settings.ollama_api_key == ""
    assert settings.ollama_base_url == "https://ollama.com"
    assert settings.ollama_model == "ministral-3:3b"
    assert settings.model_artifact_dir.endswith("backend/artifacts")
    assert settings.model_artifact_path == Path(settings.model_artifact_dir)
