"""Debug validation routes for Stage 1 auth and internal access checks."""

from fastapi import APIRouter, Depends

from backend.dependencies.auth import requireAuthenticatedUser
from backend.dependencies.internal import requireInternalSecret

router = APIRouter(tags=["debug"])


@router.get("/api/debug/auth-check")
async def authCheck(
    authenticatedUser: dict[str, object] = Depends(requireAuthenticatedUser),
) -> dict[str, object]:
    return {
        "email": authenticatedUser.get("email"),
        "userId": authenticatedUser.get("userId"),
    }


@router.get("/api/debug/internal-check")
async def internalCheck(
    _internalAccess: None = Depends(requireInternalSecret),
) -> dict[str, str]:
    return {"status": "ok"}
