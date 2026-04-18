"""Account and face-profile services for Stage 2."""

from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from backend.config import getSettings
from backend.core.logger import logger
from backend.core.supabase_admin import getSupabaseAdminClient
from backend.errors import AppError
from backend.types.api import AccountResponse, AccountUserPayload, FaceProfileStatus


def getAccount(userId: str) -> AccountResponse:
    userRecord = _getUserRecord(userId)
    return AccountResponse(user=_mapAccountUser(userRecord))


def updateAccountProfile(
    userId: str,
    name: str,
    avatar: UploadFile | None,
) -> AccountResponse:
    if not name.strip():
        raise AppError(
            "A profile name is required.",
            code="VALIDATION_ERROR",
            status=400,
        )

    if avatar is not None and avatar.filename:
        raise AppError(
            "Avatar uploads still need a dedicated storage bucket and URL policy before they can be enabled safely on Vercel.",
            code="FEATURE_NOT_READY",
            status=400,
        )

    response = (
        getSupabaseAdminClient()
        .table("users")
        .update({"name": name.strip()})
        .eq("id", userId)
        .execute()
    )
    _raiseOnSupabaseError(response, "PictureMe could not update your profile.")
    return getAccount(userId)


async def replaceFaceProfile(
    userId: str,
    files: list[UploadFile],
) -> FaceProfileStatus:
    validFiles = [file for file in files if file.filename]
    if not validFiles:
        raise AppError(
            "At least one face scan image is required.",
            code="FACE_PROFILE_REQUIRED",
            status=400,
        )

    await _deleteExistingFaceProfileAssets(userId)

    uploadedPaths: list[str] = []
    for index, file in enumerate(validFiles, start=1):
        uploadedPaths.append(await _storeFaceProfileImage(userId, file, index))

    indexedAt = datetime.now(timezone.utc).isoformat()
    _insertFaceProfileRows(userId, uploadedPaths)
    _updateUserFaceProfile(userId, indexedAt)

    # AWS API keys will be required here before Rekognition indexing can run on Vercel.
    logger.info(
        "Face profile stored for user %s. Rekognition indexing remains a follow-up step.",
        userId,
    )

    return FaceProfileStatus(hasFaceProfile=True, indexedAt=indexedAt)


async def deleteFaceProfile(userId: str) -> FaceProfileStatus:
    await _deleteExistingFaceProfileAssets(userId)
    getSupabaseAdminClient().table("user_photo_matches").delete().eq("user_id", userId).execute()
    (
        getSupabaseAdminClient()
        .table("users")
        .update(
            {
                "face_indexed_at": None,
                "rekognition_face_id": None,
            }
        )
        .eq("id", userId)
        .execute()
    )
    return FaceProfileStatus(hasFaceProfile=False, indexedAt=None)


def _getFaceProfilePaths(userId: str) -> list[str]:
    response = (
        getSupabaseAdminClient()
        .table("face_profile_images")
        .select("storage_path")
        .eq("user_id", userId)
        .order("sort_order")
        .execute()
    )
    _raiseOnSupabaseError(response, "PictureMe could not load your face profile.")
    rows = response.data or []
    return [
        row["storage_path"]
        for row in rows
        if isinstance(row, dict) and isinstance(row.get("storage_path"), str)
    ]


def _getUserRecord(userId: str) -> dict[str, object]:
    response = (
        getSupabaseAdminClient()
        .table("users")
        .select("id, email, name, avatar_url, face_indexed_at")
        .eq("id", userId)
        .single()
        .execute()
    )
    _raiseOnSupabaseError(response, "PictureMe could not load your account settings.")
    if not isinstance(response.data, dict):
        raise AppError(
            "Your PictureMe profile is not ready yet. Please sign out and sign back in.",
            code="ACCOUNT_NOT_READY",
            status=404,
        )
    return response.data


def _insertFaceProfileRows(userId: str, uploadedPaths: list[str]) -> None:
    rows = [
        {
            "storage_path": storagePath,
            "sort_order": sortOrder,
            "user_id": userId,
        }
        for sortOrder, storagePath in enumerate(uploadedPaths, start=1)
    ]
    response = getSupabaseAdminClient().table("face_profile_images").insert(rows).execute()
    _raiseOnSupabaseError(response, "PictureMe could not save your face profile.")


def _mapAccountUser(row: dict[str, object]) -> AccountUserPayload:
    faceIndexedAt = row.get("face_indexed_at")
    return AccountUserPayload(
        avatarUrl=row.get("avatar_url") if isinstance(row.get("avatar_url"), str) else None,
        email=str(row.get("email") or ""),
        faceIndexedAt=faceIndexedAt if isinstance(faceIndexedAt, str) else None,
        hasFaceProfile=bool(faceIndexedAt),
        id=str(row.get("id") or ""),
        name=str(row.get("name") or "PictureMe User"),
    )


async def _deleteExistingFaceProfileAssets(userId: str) -> None:
    existingPaths = _getFaceProfilePaths(userId)
    if existingPaths:
        getSupabaseAdminClient().storage.from_(getSettings().faceProfileBucket).remove(existingPaths)
    getSupabaseAdminClient().table("face_profile_images").delete().eq("user_id", userId).execute()


def _raiseOnSupabaseError(response: object, fallbackMessage: str) -> None:
    error = getattr(response, "error", None)
    if error is not None:
        raise AppError(
            fallbackMessage,
            code="SUPABASE_ERROR",
            status=500,
            details={"error": str(error)},
        )


async def _storeFaceProfileImage(
    userId: str,
    file: UploadFile,
    sortOrder: int,
) -> str:
    fileExtension = Path(file.filename or "").suffix.lower() or ".jpg"
    storagePath = f"{userId}/{uuid4()}-{sortOrder}{fileExtension}"
    fileBytes = await file.read()
    if not fileBytes:
        raise AppError(
            "Face scan uploads cannot be empty.",
            code="FACE_PROFILE_REQUIRED",
            status=400,
        )

    getSupabaseAdminClient().storage.from_(getSettings().faceProfileBucket).upload(
        storagePath,
        fileBytes,
        {
            "content-type": file.content_type or "image/jpeg",
            "upsert": "true",
        },
    )
    return storagePath


def _updateUserFaceProfile(userId: str, indexedAt: str) -> None:
    response = (
        getSupabaseAdminClient()
        .table("users")
        .update(
            {
                "face_indexed_at": indexedAt,
                "rekognition_face_id": None,
            }
        )
        .eq("id", userId)
        .execute()
    )
    _raiseOnSupabaseError(response, "PictureMe could not update your face profile.")
