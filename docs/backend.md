# Backend

## Purpose

The backend in [backend](/Users/tervin23/Documents/AG/PictureMe/backend) is a FastAPI service that will own API routing, Supabase JWT validation, protected runtime configuration boundaries, and the orchestration layer for event, gallery, upload, matching, and cleanup workflows.

## Stage 1 Contents

- [backend/main.py](/Users/tervin23/Documents/AG/PictureMe/backend/main.py): FastAPI application setup, middleware registration, route mounting, and local startup entrypoint.
- [backend/config.py](/Users/tervin23/Documents/AG/PictureMe/backend/config.py): Environment validation and typed settings access.
- [backend/errors.py](/Users/tervin23/Documents/AG/PictureMe/backend/errors.py): Stable API error shape and global exception handlers.
- [backend/core](/Users/tervin23/Documents/AG/PictureMe/backend/core): Logger setup plus Supabase admin and user-scoped client helpers.
- [backend/dependencies](/Users/tervin23/Documents/AG/PictureMe/backend/dependencies): Supabase bearer-token validation and internal-only route protection.
- [backend/middleware](/Users/tervin23/Documents/AG/PictureMe/backend/middleware): Request logging middleware for Stage 1.
- [backend/routes](/Users/tervin23/Documents/AG/PictureMe/backend/routes): Health, runtime-config, and debug validation routes for Stage 1.

## Runtime Boundary

- Browser-safe config may be exposed through the runtime-config endpoint.
- Secrets remain backend-only and must never be forwarded wholesale to the frontend.
- Supabase remains the source of truth for auth and relational data.
- Stage 1 includes debug-only validation routes so auth and internal secret handling can be verified before feature routes are implemented.
