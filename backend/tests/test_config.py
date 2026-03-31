from pathlib import Path

from app.core.config import Settings


def test_settings_expose_local_model_artifact_config(monkeypatch) -> None:
    monkeypatch.delenv("MODEL_ARTIFACT_DIR", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)

    settings = Settings()

    assert settings.anthropic_api_key == ""
    assert settings.model_artifact_dir.endswith("backend/artifacts")
    assert settings.model_artifact_path == Path(settings.model_artifact_dir)
