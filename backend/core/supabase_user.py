"""Supabase client factory for user-scoped queries."""

from supabase import Client, create_client

from backend.config import getSettings


def createSupabaseUserClient(accessToken: str) -> Client:
    settings = getSettings()
    client = create_client(settings.supabaseUrl, settings.supabaseSecretKeyValue)
    client.postgrest.auth(accessToken)
    return client
