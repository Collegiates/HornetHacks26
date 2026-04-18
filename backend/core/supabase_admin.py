"""Server-side Supabase admin client."""

from supabase import Client, create_client

from backend.config import getSettings


def getSupabaseAdminClient() -> Client:
    settings = getSettings()
    return create_client(settings.supabaseUrl, settings.supabaseSecretKey)
