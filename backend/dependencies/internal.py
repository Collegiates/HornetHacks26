"""Internal-only route protection dependency."""

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.config import getSettings
from backend.errors import AppError

_bearer_scheme = HTTPBearer(auto_error=False)


async def require_internal_secret(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> None:
    """Reject requests that do not carry the internal API secret.

    Used for internal operations like cleanup that should not be accessible
    from the public internet without the shared secret.
    """
    settings = getSettings()

    if credentials is None or credentials.credentials != settings.internal_api_secret:
        raise AppError("Forbidden", code="FORBIDDEN", status=403)
