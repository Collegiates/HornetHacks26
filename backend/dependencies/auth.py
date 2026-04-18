"""Supabase bearer-token validation dependency."""

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.core.supabase_admin import getSupabaseAdminClient
from backend.errors import AppError

bearerScheme = HTTPBearer(auto_error=False)


async def requireAuthenticatedUser(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearerScheme),
) -> dict[str, object]:
    """Validate a Supabase JWT and return user claims."""
    if credentials is None or not credentials.credentials:
        raise AppError(
            "A valid bearer token is required.",
            code="AUTH_REQUIRED",
            status=401,
        )

    token = credentials.credentials
    try:
        userResponse = getSupabaseAdminClient().auth.get_user(token)
    except Exception as exc:
        raise AppError(
            "The supplied bearer token is invalid.",
            code="AUTH_INVALID",
            status=401,
        ) from exc

    user = getattr(userResponse, "user", None)
    if user is None:
        raise AppError(
            "The supplied bearer token is invalid.",
            code="AUTH_INVALID",
            status=401,
        )

    authenticatedUser = {
        "email": getattr(user, "email", None),
        "token": token,
        "userId": str(getattr(user, "id")),
    }
    request.state.authenticatedUser = authenticatedUser
    return authenticatedUser
