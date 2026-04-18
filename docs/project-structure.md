# Project Structure

## Repository Purpose

This repository contains the code and documentation for PictureMe, an event photo matching platform built around account-based face registration, event creation, event-specific roles, gallery uploads, personalized galleries, and event history.

## Major Folders

### [frontend](/Users/tervin23/Documents/AG/PictureMe/frontend)

Purpose:

- Hosts the attendee-facing and organizer-facing web experience.
- Likely contains account creation, face registration, event creation, contributor management, QR event check-in, gallery views, and previous event history screens as the project develops.

Current state:

- Placeholder directory ready for implementation.

### [backend](/Users/tervin23/Documents/AG/PictureMe/backend)

Purpose:

- Hosts server-side logic for photo ingestion, face processing, matching, database access, and SMS delivery.
- Will coordinate the integrations with AWS Rekognition, Cloudinary, Supabase, and Twilio.
- Will likely enforce event organizer permissions, contributor authorization, attendee enrollment, and personal gallery generation.

Current state:

- Placeholder directory ready for implementation.

### [docs](/Users/tervin23/Documents/AG/PictureMe/docs)

Purpose:

- Stores project-level documentation.
- Defines the intended scope, architecture direction, and folder responsibilities.

Current files:

- `scope.md`: Defines the product goal, core moving parts, and scope limits.
- `project-structure.md`: Describes the main folders and their responsibilities.
