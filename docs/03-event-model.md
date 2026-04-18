# PictureMe — event model & permissions

## Creating an event

### Step 1 — Fill out event details
- Event name (required)
- Date (required)
- Description (optional)
- Cover photo (optional)

When the user hits **Create Event**, a unique join token such as `abc123` is generated and stored in Supabase. A Rekognition face collection is created in the background for this event so uploaded photos can be indexed immediately.

**APIs:** Supabase `events` INSERT, Rekognition `CreateCollection`

### Step 2 — Event created
The creator sees an event dashboard with:
- Shareable link: `pictureme.app/join/abc123`
- Downloadable QR code (PNG)
- Upload Photos button

**APIs:** `qrcode.react` npm library

### Step 3 — Upload photos (admin only)
The creator and any granted admins see an **Upload Photos** button.

- Drag and drop or file picker, with batch upload support
- Photos upload to Cloudinary for storage and CDN delivery
- Each photo is indexed through Rekognition; every detected face receives a `FaceId` in the event collection
- Upload progress is shown in real time, for example *"47 of 94 photos indexed"*
- After upload is accepted, background matching jobs run for all existing event members who have completed face enrollment

**APIs:** Cloudinary upload API, Rekognition `IndexFaces`, Supabase `photos` + `face_index` INSERT, FastAPI background tasks

### Step 4 — Grant admin access
Creator: **Event Settings → Members → [user] → Toggle Admin**

That user now sees the Upload Photos button. Role is revocable at any time.

**APIs:** Supabase `event_members` UPDATE `role = 'admin'`

---

## Permission model

| Role | View gallery | Upload photos | Manage members | Delete event |
|---|---|---|---|---|
| Creator | Yes | Yes | Yes | Yes |
| Admin | Yes | Yes | No | No |
| Member | Yes | No | No | No |
| Non-member (logged in) | No — must join first | No | No | No |
| Not logged in | No — must sign in | No | No | No |

---

## Gallery expiry — 30-day policy

> **All event galleries expire 30 days after the event date.**

### What expiry means
- Photos are deleted from Cloudinary storage
- The Rekognition collection for the event is deleted
- The event page shows a *"This gallery has expired"* message
- Event metadata such as name, date, and member list is retained so creators can still see event history, but photos are gone

### User communication
- Organizer is shown the expiry date prominently on the event dashboard from day one
- A reminder email is sent 7 days before expiry via SendGrid
- Members see a countdown banner on the gallery: *"This gallery expires in 8 days — download your photos"*

### Storage rationale
A 30-day retention period keeps storage costs predictable and manageable. Most photo retrieval happens in the first few days after an event.

### Implementation
A scheduled background job runs nightly. It queries Supabase for events where `date + 30 days < now` and fires the cleanup pipeline:

```
1. Fetch all event photo cloudinary_ids
2. Call Cloudinary bulk delete
3. Call Rekognition DeleteCollection
4. Update event status to 'expired' in Supabase
5. Delete rows from face_index and user_photo_matches for this event
6. Retain events, event_members, and photos metadata with delivery URLs cleared
```

**APIs:** Cloudinary bulk delete, Rekognition `DeleteCollection`, scheduled cleanup job via Supabase or external cron

---

## Joining an event

Any logged-in user with the QR code or link can join an event. The join page shows:
- Event name and cover photo
- Host name
- Number of photos uploaded, if any
- **Join Event** button

On join:
- A row is inserted into `event_members`
- If the user has a completed face profile, a background task begins matching their 3–5 enrollment selfies against the event collection using `SearchFacesByImage`
- Matched photos are written to `user_photo_matches`
- The user is redirected to the event gallery immediately; My Photos may populate a few moments later

This asynchronous approach keeps the join experience fast and realistic.
