# PictureMe — event model & permissions

## Creating an event

### Step 1 — Fill out event details
- Event name (required)
- Date (required)
- Description (optional)
- Cover photo (optional)

Hit **Create Event**. A unique join token (e.g. `abc123`) is generated and stored in Supabase. A Rekognition Face Collection is created in the background for this event — ready to receive indexed photos.

**APIs:** Supabase `events` INSERT, Rekognition `CreateCollection`

### Step 2 — Event created
Creator sees their event dashboard with:
- Shareable link: `pictureme.app/join/abc123`
- Downloadable QR code (PNG)
- Upload photos button

**APIs:** `qrcode.react` npm library

### Step 3 — Upload photos (admin only)
Creator and any users granted admin access see an **Upload Photos** button.

- Drag-and-drop or file picker, supports batch upload
- Photos upload to Cloudinary for storage and CDN delivery
- Each photo is indexed via Rekognition — every detected face gets a `FaceId` stored in the event's Rekognition collection
- Upload progress shown in real time: *"47 of 94 photos indexed"*
- All existing event members with a face profile are automatically re-matched against new photos on upload

**APIs:** Cloudinary `upload_stream`, Rekognition `IndexFaces`, Supabase `photos` + `face_index` INSERT

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
- The Rekognition Face Collection for the event is deleted
- The event page shows an *"This gallery has expired"* message
- Event metadata (name, date, member list) is retained so creators can see their event history — but photos are gone

### User communication
- Organizer is shown the expiry date prominently on the event dashboard from day one
- A reminder email is sent 7 days before expiry (via SendGrid)
- Members see a countdown banner on the gallery: *"This gallery expires in 8 days — download your photos"*

### Storage rationale
Galleries expiring after 30 days keeps storage costs predictable and manageable. Most photo retrieval happens in the first few days after an event.

### Implementation
A scheduled background job runs nightly. It queries Supabase for events where `date + 30 days < now` and fires the cleanup pipeline:

```
1. Fetch all photo cloudinary_ids for the event
2. Call Cloudinary bulk delete
3. Call Rekognition DeleteCollection
4. Update event status to 'expired' in Supabase
5. Delete rows from face_index and user_photo_matches for this event
6. Retain: events, event_members, photos metadata (url set to null)
```

**APIs:** Cloudinary bulk delete, Rekognition `DeleteCollection`, Supabase scheduled function (pg_cron or external cron job)

---

## Joining an event

Any logged-in user with the QR code or link can join an event. The join page shows:
- Event name + cover photo
- Host name
- Number of photos uploaded (if any)
- **Join Event** button

On join:
- Row inserted into `event_members`
- If user has a face profile: Rekognition `SearchFaces` runs immediately against the event's collection
- Matched photos are written to `user_photo_matches`
- User is redirected to the event gallery — My Photos tab is already populated
