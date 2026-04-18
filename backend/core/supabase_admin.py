"""Server-side Supabase admin client."""

from functools import lru_cache

from supabase import Client, create_client

from backend.config import getSettings


@lru_cache
def getSupabaseAdminClient() -> Client:
    settings = getSettings()
    return create_client(settings.supabaseUrl, settings.supabaseSecretKeyValue)
