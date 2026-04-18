# Backend

## Purpose

The backend in [backend](/Users/tervin23/Documents/AG/PictureMe/backend) is a FastAPI service that will own API routing, Supabase JWT validation, protected runtime configuration boundaries, and the orchestration layer for event, gallery, upload, matching, and cleanup workflows.

## Active Contents

- [backend/main.py](/Users/tervin23/Documents/AG/PictureMe/backend/main.py): FastAPI application setup, middleware registration, route mounting, and local startup entrypoint.
- [backend/config.py](/Users/tervin23/Documents/AG/PictureMe/backend/config.py): Environment validation, Vercel-safe env loading, and typed settings access.
- [backend/errors.py](/Users/tervin23/Documents/AG/PictureMe/backend/errors.py): Stable API error shape and global exception handlers.
- [backend/core](/Users/tervin23/Documents/AG/PictureMe/backend/core): Logger setup plus Supabase admin and user-scoped client helpers.
- [backend/dependencies](/Users/tervin23/Documents/AG/PictureMe/backend/dependencies): Supabase bearer-token validation and internal-only route protection.
- [backend/middleware](/Users/tervin23/Documents/AG/PictureMe/backend/middleware): Request logging middleware for backend-owned routes.
- [backend/routes](/Users/tervin23/Documents/AG/PictureMe/backend/routes): Health, runtime-config, debug validation, and Stage 2 account routes.
- [backend/services](/Users/tervin23/Documents/AG/PictureMe/backend/services): Account and face-profile orchestration against Supabase tables and storage.
- [api/index.py](/Users/tervin23/Documents/AG/PictureMe/api/index.py): Vercel Python function entrypoint that exposes the FastAPI app.
- [vercel.json](/Users/tervin23/Documents/AG/PictureMe/vercel.json): Vercel rewrite and function-duration configuration for `/api`.

## Runtime Boundary

- Browser-safe config may be exposed through the runtime-config endpoint.
- Secrets remain backend-only and must never be forwarded wholesale to the frontend.
- Supabase remains the source of truth for auth and relational data.
- Face-profile uploads are stored through the backend into Supabase Storage, while Rekognition indexing remains an explicit follow-up integration point.
- The deploy target is Vercel, so the backend is exposed as a Python function entrypoint rather than relying only on a local Uvicorn process.
