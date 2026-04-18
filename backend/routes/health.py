"""Health endpoint."""

from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/api/health")
async def health_check() -> dict:
    """Return a stable backend health payload."""
    return {
        "service": "pictureme-backend",
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
