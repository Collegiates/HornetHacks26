# Backend

## Purpose

The backend in [backend](/Users/tervin23/Documents/AG/PictureMe/backend) is a FastAPI service that will own API routing, Supabase JWT validation, protected runtime configuration boundaries, and the orchestration layer for event, gallery, upload, matching, and cleanup workflows.

## Stage 1 Contents

- [backend/app/main.py](/Users/tervin23/Documents/AG/PictureMe/backend/app/main.py): FastAPI application setup, middleware registration, and route mounting.
- [backend/app/config.py](/Users/tervin23/Documents/AG/PictureMe/backend/app/config.py): Environment validation and typed settings access.
- [backend/app/errors.py](/Users/tervin23/Documents/AG/PictureMe/backend/app/errors.py): Stable API error shape and global exception handlers.
- [backend/app/dependencies/auth.py](/Users/tervin23/Documents/AG/PictureMe/backend/app/dependencies/auth.py): Supabase bearer-token validation dependency.
- [backend/app/dependencies/internal.py](/Users/tervin23/Documents/AG/PictureMe/backend/app/dependencies/internal.py): Internal-only route protection.
- [backend/app/routes](/Users/tervin23/Documents/AG/PictureMe/backend/app/routes): Health, runtime-config, and debug validation routes for Stage 1.
- [backend/main.py](/Users/tervin23/Documents/AG/PictureMe/backend/main.py): Local FastAPI startup entrypoint.

## Runtime Boundary

- Browser-safe config may be exposed through the runtime-config endpoint.
- Secrets remain backend-only and must never be forwarded wholesale to the frontend.
- Supabase remains the source of truth for auth and relational data.
