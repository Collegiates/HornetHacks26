"""Public runtime-config endpoint (browser-safe values only)."""

from fastapi import APIRouter

from backend.config import getSettings

router = APIRouter(tags=["config"])


@router.get("/api/runtime-config")
async def runtimeConfig() -> dict[str, object]:
    """Return allowlisted browser-safe configuration values."""
    settings = getSettings()
    return settings.publicConfig
