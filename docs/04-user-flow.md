# PictureMe — full user flow

## Viewing photos — member experience

### Step 1 — Open an event
From the user's dashboard, they click an event they've joined. The gallery page loads.

> **You must be signed in to view this page.** Unauthenticated users are redirected to the login/signup page, with the event join token preserved so they land back after authenticating.

### Step 2 — "My Photos" tab (default)
Shows only photos where this user's face was matched.

**Matching runs at two moments:**
- When the user first joins the event — their stored `FaceId` is immediately searched against all already-indexed photos
- When an admin uploads new photos — all existing members with a face profile are re-checked against the new batch automatically

If the user has no face profile (opted out), this tab shows an empty state with a prompt: *"Complete your face profile in Account Settings to see your photos here."*

**APIs:** Rekognition `SearchFaces` by `FaceId`, Supabase `user_photo_matches` table

### Step 3 — "All Photos" tab
Shows every photo uploaded to the event in a responsive grid, sorted newest-first (or chronologically — organizer's choice). Any member can view all photos regardless of face scan status.

Clicking a photo opens it full size with:
- Download button (full resolution via Cloudinary)
- Share button (copies a direct link to that photo)

**APIs:** Cloudinary CDN photo delivery, Supabase `photos` SELECT WHERE `event_id`

### Step 4 — Real-time updates
When an admin uploads new photos, the gallery updates live:
- New photos appear in All Photos without a page refresh
- My Photos count updates automatically if new matches are found for the current user

**APIs:** Supabase real-time subscriptions (`photos` table INSERT listener)

### Step 5 — Download & share
- Individual photo: download button on full-size view
- All my photos: **Download All** button in My Photos tab (downloads a zip via Cloudinary)
- Shareable gallery link: users can copy a public token URL for their My Photos view — useful for sharing with family who aren't on PictureMe

**APIs:** Cloudinary download URL with `fl_attachment`, Supabase `gallery_tokens` table

---

## Photo upload triggers re-match for all members

When an admin uploads a new batch of photos:

```
For each new photo:
  1. Upload to Cloudinary → get cloudinary_url
  2. Send to Rekognition IndexFaces → get FaceIds for all detected faces
  3. Store each FaceId in face_index table linked to photo_id + event_id

For each event member with a face profile:
  1. Run Rekognition SearchFaces using member's rekognition_face_id against event collection
  2. Write any new matches to user_photo_matches
  3. Supabase real-time fires → member's My Photos count updates live
```

This runs as a background job — upload confirmation is shown to the admin immediately, matching continues asynchronously.

---

## Gallery expiry — user experience

- A persistent countdown banner appears on all event gallery pages when expiry is within 14 days
- *"This gallery expires on [date]. Download your photos before then."*
- After expiry, the event page shows: *"This gallery has expired. Photos have been deleted after 30 days."*
- Event still appears in the user's dashboard as an expired event (name, date visible — no photos)

---

## Navigation structure

```
pictureme.app/
├── /                     → Landing page (logged out) or Dashboard (logged in)
├── /signup               → Sign up + optional face scan
├── /login                → Log in
├── /dashboard            → User's events (joined + created)
├── /join/[token]         → Join event page (redirects to login/signup if not authenticated)
├── /event/[id]           → Event gallery (My Photos + All Photos tabs)
├── /event/[id]/settings  → Event settings (creator only)
├── /gallery/[token]      → Public shareable My Photos gallery
└── /account/settings     → Profile + face scan management
```
