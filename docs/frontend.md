# Frontend

## Purpose

The frontend in [frontend](/Users/tervin23/Documents/AG/PictureMe/frontend) is the browser application for PictureMe. It currently owns the visual experience, Supabase browser authentication, and a temporary direct-to-Supabase data adapter for authenticated screens while the dedicated backend is still being planned.

## Key Files

- [frontend/src/lib/supabase.ts](/Users/tervin23/Documents/AG/PictureMe/frontend/src/lib/supabase.ts): Initializes the Supabase browser client from Vite environment variables and fails fast when credentials are missing.
- [frontend/src/providers/AuthProvider.tsx](/Users/tervin23/Documents/AG/PictureMe/frontend/src/providers/AuthProvider.tsx): Tracks the current session and hydrates the signed-in user from `public.users`.
- [frontend/src/lib/api.ts](/Users/tervin23/Documents/AG/PictureMe/frontend/src/lib/api.ts): Central request layer. It uses demo responses when demo mode is active, uses the backend when `VITE_API_BASE_URL` is configured, and otherwise routes supported authenticated requests directly into Supabase.
- [frontend/src/lib/supabaseApi.ts](/Users/tervin23/Documents/AG/PictureMe/frontend/src/lib/supabaseApi.ts): Temporary Supabase-backed implementation for authenticated account, dashboard, event detail, and event settings routes.
- [frontend/src/pages](/Users/tervin23/Documents/AG/PictureMe/frontend/src/pages): Route-level UI for signup, login, dashboard, event gallery, event settings, join flow, and account settings.
- [frontend/src/components](/Users/tervin23/Documents/AG/PictureMe/frontend/src/components): Reusable UI building blocks such as navigation, upload modal, photo grids, and route guards.

## Current Supabase Boundary

- Browser auth is now connected to the live Supabase project through `frontend/.env.local`.
- Email/password and Google OAuth entry points are wired in the frontend auth surfaces and use Supabase Auth directly.
- Authenticated reads and simple writes for account and event management can run directly against Supabase when no backend base URL is configured.
- Media uploads, public gallery token resolution, invite preview for unauthenticated users, and face-indexing workflows still require the planned backend layer.
