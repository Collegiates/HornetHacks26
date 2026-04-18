"""Environment validation and typed settings access."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed settings validated at startup from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    port: int = 8000
    node_env: str = "development"
    app_origin: str = "http://localhost:3000"
    frontend_origin: str = "http://localhost:5173"
    log_level: str = "info"

    # Supabase
    supabase_url: str = ""
    supabase_service_role_key: str = ""

    # Internal
    internal_api_secret: str = "replace-me"

    # OAuth
    google_oauth_enabled: bool = True

    @property
    def is_development(self) -> bool:
        return self.node_env == "development"

    @property
    def public_config(self) -> dict:
        """Browser-safe config values that can be exposed to the frontend."""
        return {
            "appOrigin": self.app_origin,
            "frontendOrigin": self.frontend_origin,
            "googleOAuthEnabled": self.google_oauth_enabled,
        }


@lru_cache
def getSettings() -> Settings:
    """Return a cached Settings instance. Fails fast on missing required config."""
    return Settings()
