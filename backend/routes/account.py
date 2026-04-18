"""Stage 2 account and face-profile routes."""

from fastapi import APIRouter, Depends, File, Form, UploadFile

from backend.dependencies.auth import requireAuthenticatedUser
from backend.services.account_service import (
    deleteFaceProfile,
    getAccount,
    replaceFaceProfile,
    updateAccountProfile,
)
from backend.types.api import AccountResponse, FaceProfileStatus

router = APIRouter(tags=["account"])


@router.get("/api/account", response_model=AccountResponse)
async def getAccountRoute(
    authenticatedUser: dict[str, object] = Depends(requireAuthenticatedUser),
) -> AccountResponse:
    return getAccount(str(authenticatedUser["userId"]))


@router.patch("/api/account/profile", response_model=AccountResponse)
async def patchAccountProfileRoute(
    name: str = Form(...),
    avatar: UploadFile | None = File(default=None),
    authenticatedUser: dict[str, object] = Depends(requireAuthenticatedUser),
) -> AccountResponse:
    return updateAccountProfile(
        userId=str(authenticatedUser["userId"]),
        name=name,
        avatar=avatar,
    )


@router.post("/api/account/face-profile", response_model=FaceProfileStatus)
async def postFaceProfileRoute(
    face: UploadFile | None = File(default=None),
    authenticatedUser: dict[str, object] = Depends(requireAuthenticatedUser),
) -> FaceProfileStatus:
    files = [face] if face is not None else []
    return await replaceFaceProfile(
        userId=str(authenticatedUser["userId"]),
        files=files,
    )


@router.delete("/api/account/face-profile", response_model=FaceProfileStatus)
async def deleteFaceProfileRoute(
    authenticatedUser: dict[str, object] = Depends(requireAuthenticatedUser),
) -> FaceProfileStatus:
    return await deleteFaceProfile(str(authenticatedUser["userId"]))
