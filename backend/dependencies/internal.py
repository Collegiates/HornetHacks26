"""Internal-only route protection dependency."""

import secrets
from typing import Annotated

from fastapi import Header

from backend.config import getSettings
from backend.errors import AppError


async def requireInternalSecret(
    internalApiSecret: Annotated[str | None, Header(alias="x-internal-api-secret")] = None,
) -> None:
    """Reject requests that do not carry the internal API secret."""
    settings = getSettings()
    if internalApiSecret is None or not secrets.compare_digest(
        internalApiSecret,
        settings.internalApiSecretValue,
    ):
        raise AppError(
            "This route is restricted to internal callers.",
            code="INTERNAL_ONLY",
            status=403,
        )
