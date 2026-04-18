"""Request logging middleware."""

from time import perf_counter
from typing import Awaitable, Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from backend.core.logger import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self,
        request: Request,
        callNext: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        startTime = perf_counter()
        response = await callNext(request)
        durationMs = round((perf_counter() - startTime) * 1000, 2)
        logger.info(
            "%s %s -> %s in %sms",
            request.method,
            request.url.path,
            response.status_code,
            durationMs,
        )
        return response
