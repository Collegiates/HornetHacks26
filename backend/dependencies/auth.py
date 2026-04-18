"""Supabase bearer-token validation dependency."""

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.core.supabase_admin import getSupabaseAdminClient
from backend.errors import AppError

bearerScheme = HTTPBearer(auto_error=False)


async def require_authenticated_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearerScheme),
) -> dict:
    """Validate a Supabase JWT and return user claims."""
    if credentials is None:
        raise AppError(
            "A valid bearer token is required.",
            code="AUTH_REQUIRED",
            status=401,
        )

    token = credentials.credentials
    if not token:
        raise AppError(
            "A valid bearer token is required.",
            code="AUTH_REQUIRED",
            status=401,
        )

    supabaseAdminClient = getSupabaseAdminClient()
    userResponse = supabaseAdminClient.auth.get_user(token)
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
