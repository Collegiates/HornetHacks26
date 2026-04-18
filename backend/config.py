"""Environment validation and typed settings access."""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed settings validated at startup from environment variables."""

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    appOrigin: str = Field(alias="APP_ORIGIN")
    frontendOrigin: str = Field(alias="FRONTEND_ORIGIN")
    googleOAuthEnabled: bool = Field(default=False, alias="GOOGLE_OAUTH_ENABLED")
    internalApiSecret: str = Field(alias="INTERNAL_API_SECRET")
    logLevel: Literal["debug", "info", "warn", "error"] = Field(
        default="info",
        alias="LOG_LEVEL",
    )
    appEnv: Literal["development", "test", "production"] = Field(
        default="development",
        validation_alias=AliasChoices("APP_ENV", "NODE_ENV"),
    )
    port: int = Field(default=8000, alias="PORT")
    supabasePublishableKey: str = Field(default="", alias="SUPABASE_PUBLISHABLE_KEY")
    supabaseSecretKey: str = Field(
        validation_alias=AliasChoices("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"),
    )
    supabaseUrl: str = Field(alias="SUPABASE_URL")

    @property
    def isDevelopment(self) -> bool:
        return self.appEnv == "development"

    @property
    def publicConfig(self) -> dict[str, object]:
        """Browser-safe config values that can be exposed to the frontend."""
        return {
            "apiBaseUrl": self.appOrigin,
            "appOrigin": self.appOrigin,
            "frontendOrigin": self.frontendOrigin,
            "googleOAuthEnabled": self.googleOAuthEnabled,
        }


@lru_cache
def getSettings() -> Settings:
    """Return a cached settings instance and fail fast on invalid config."""
    return Settings()
