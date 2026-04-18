"""Health endpoint."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/api/health")
async def health_check():
    """Return a simple health status."""
    return {"status": "ok"}
