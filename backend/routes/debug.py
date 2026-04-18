"""Debug validation routes for Stage 1 auth and internal access checks."""

from fastapi import APIRouter, Depends

from backend.dependencies.auth import require_authenticated_user
from backend.dependencies.internal import require_internal_secret

router = APIRouter(tags=["debug"])


@router.get("/api/debug/auth-check")
async def auth_check(
    authenticatedUser: dict = Depends(require_authenticated_user),
) -> dict:
    return {
        "email": authenticatedUser.get("email"),
        "userId": authenticatedUser.get("userId"),
    }


@router.get("/api/debug/internal-check")
async def internal_check(
    _internalAccess: None = Depends(require_internal_secret),
) -> dict:
    return {"status": "ok"}
