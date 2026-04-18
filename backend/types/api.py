"""Shared API response models."""

from pydantic import BaseModel


class AccountUserPayload(BaseModel):
    avatarUrl: str | None = None
    email: str
    faceIndexedAt: str | None = None
    hasFaceProfile: bool
    id: str
    name: str


class AccountResponse(BaseModel):
    user: AccountUserPayload


class FaceProfileStatus(BaseModel):
    hasFaceProfile: bool
    indexedAt: str | None = None
