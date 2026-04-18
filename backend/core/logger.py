"""Structured logger setup for the FastAPI backend."""

import logging

from backend.config import getSettings

settings = getSettings()

logging.basicConfig(
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
    level=getattr(logging, settings.logLevel.upper(), logging.INFO),
)

logger = logging.getLogger("pictureme-backend")
