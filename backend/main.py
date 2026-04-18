"""FastAPI application setup, middleware, error handlers, route mounting, and local entrypoint."""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import getSettings
from backend.errors import registerErrorHandlers
from backend.middleware.request_logging import RequestLoggingMiddleware
from backend.routes.debug import router as debugRouter
from backend.routes.health import router as health_router
from backend.routes.runtime_config import router as config_router

settings = getSettings()

app = FastAPI(
    title="PictureMe API",
    version="0.1.0",
    docs_url="/api/docs" if settings.isDevelopment else None,
    redoc_url="/api/redoc" if settings.isDevelopment else None,
)

# --- Middleware -----------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontendOrigin, settings.appOrigin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware)

# --- Error handlers -------------------------------------------------------

registerErrorHandlers(app)

# --- Routes ---------------------------------------------------------------

app.include_router(health_router)
app.include_router(config_router)
app.include_router(debugRouter)


# --- Local entrypoint -----------------------------------------------------

def _run() -> None:
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.isDevelopment,
    )


if __name__ == "__main__":
    _run()
