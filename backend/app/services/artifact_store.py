from pathlib import Path
from typing import Dict, Optional

from app.core.config import settings


class ArtifactStore:
    REQUIRED_FILES = {
        "scaler": "scaler_v3.pkl",
        "pca": "pca_v3.pkl",
        "weights": "v4_weights.json",
        "tracks": "fma_pre_z_filtered_avail.csv",
    }

    def __init__(self, artifact_dir: Optional[Path] = None) -> None:
        self.artifact_dir = Path(artifact_dir or settings.model_artifact_path)

    def resolve_required_paths(self) -> Dict[str, Path]:
        resolved = {
            key: self.artifact_dir / filename for key, filename in self.REQUIRED_FILES.items()
        }
        missing = [path.name for path in resolved.values() if not path.exists()]
        if missing:
            joined = ", ".join(sorted(missing))
            raise FileNotFoundError(f"Missing model artifacts in {self.artifact_dir}: {joined}")
        return resolved
