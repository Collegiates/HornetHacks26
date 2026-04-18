"""Supabase bearer-token validation dependency."""

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.errors import AppError

_bearer_scheme = HTTPBearer(auto_error=False)


async def require_authenticated_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> dict:
    """Validate a Supabase JWT and return user claims.

    Attaches userId, email, and raw claims to the request state.
    For Stage 1 this is a placeholder — full JWT verification will be added
    once supabase-admin client is wired.
    """
    if credentials is None:
        raise AppError("Missing authorization header", code="UNAUTHORIZED", status=401)

    token = credentials.credentials
    if not token:
        raise AppError("Invalid bearer token", code="UNAUTHORIZED", status=401)

    # TODO(stage-2): verify token via supabase admin client and decode claims
    user = {"token": token}
    request.state.user = user
    return user
