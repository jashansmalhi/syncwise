from pathlib import Path

import pytest

from app.services.artifact_store import ArtifactStore


def test_resolve_required_paths_returns_all_expected_files(tmp_path: Path) -> None:
    for filename in ArtifactStore.REQUIRED_FILES.values():
        (tmp_path / filename).write_text("stub", encoding="utf-8")

    store = ArtifactStore(artifact_dir=tmp_path)

    resolved = store.resolve_required_paths()

    assert resolved["scaler"] == tmp_path / "scaler_v3.pkl"
    assert resolved["pca"] == tmp_path / "pca_v3.pkl"
    assert resolved["weights"] == tmp_path / "v4_weights.json"
    assert resolved["tracks"] == tmp_path / "fma_pre_z_filtered_avail.csv"


def test_resolve_required_paths_raises_for_missing_files(tmp_path: Path) -> None:
    (tmp_path / "scaler_v3.pkl").write_text("stub", encoding="utf-8")

    store = ArtifactStore(artifact_dir=tmp_path)

    with pytest.raises(FileNotFoundError, match="pca_v3.pkl"):
        store.resolve_required_paths()
