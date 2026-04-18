"""Stable API error shape and global exception handlers."""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from backend.core.logger import logger


class AppError(Exception):
    """Application-level error with a stable JSON contract."""

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        status: int = 500,
        details: dict | None = None,
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status = status
        self.details = details


def errorResponse(
    message: str,
    code: str,
    status: int,
    details: dict | None = None,
) -> JSONResponse:
    """Build a consistent error JSON response."""
    body: dict[str, object] = {"message": message, "code": code}
    if details is not None:
        body["details"] = details
    return JSONResponse(status_code=status, content=body)


def registerErrorHandlers(app: FastAPI) -> None:
    """Attach global exception handlers to the FastAPI app."""

    @app.exception_handler(AppError)
    async def appErrorHandler(_request: Request, exc: AppError) -> JSONResponse:
        return errorResponse(exc.message, exc.code, exc.status, exc.details)

    @app.exception_handler(RequestValidationError)
    async def validationErrorHandler(
        _request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        return errorResponse(
            "The request payload is invalid.",
            "VALIDATION_ERROR",
            422,
            {"errors": exc.errors()},
        )

    @app.exception_handler(404)
    async def notFoundHandler(_request: Request, _exc: Exception) -> JSONResponse:
        return errorResponse("Not found", "NOT_FOUND", 404)

    @app.exception_handler(Exception)
    async def genericErrorHandler(_request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled backend error", exc_info=exc)
        return errorResponse(
            "PictureMe could not complete the request.",
            "INTERNAL_SERVER_ERROR",
            500,
        )
