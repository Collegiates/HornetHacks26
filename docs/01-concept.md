# PictureMe — concept overview

## What is PictureMe

PictureMe is an event photo platform where every user has a persistent account optionally tied to a face profile. When you attend any event on PictureMe, the platform can use your saved face profile to find your photos automatically without making you re-enroll for every event.

Organizers create events, generate a shareable QR code or link, and grant photo upload access to trusted collaborators such as photographers and co-hosts. Attendees join via the QR code or link. Users who completed a face profile during signup will eventually see their matched photos under **My Photos**. Users who opted out of the face profile can still browse the full event gallery under **All Photos**.

**You must be signed in to view any event gallery.**

---

## The core problem

After every major event — a wedding, graduation ceremony, corporate conference, hackathon, or sports tournament — a photographer delivers 500 to 3,000 photos to a shared Google Drive, Dropbox, or gallery link. Every attendee gets the same link. Finding yourself requires manually scrolling through the entire set, squinting at thumbnails, and hoping you remember what you wore. Most people give up after a few minutes. Great photos go unseen. Photographers get less credit and fewer referrals. Organizers get no engagement data.

---

## The solution in three steps

1. Organizer creates an event and uploads photos
2. Attendee scans a QR code or opens the link, then signs up or logs in
3. PictureMe shows them **My Photos** after matching completes, plus **All Photos** for the full gallery

---

## What makes this different from anything existing

- **Google Photos** can find a person, but only inside your own personal photo library
- **Facebook** auto-tagging depends on a social platform account and carries significant consent concerns
- **Event photo apps** like Pic-Time and Sprout Studio are built primarily for photographers selling prints, not for attendees self-serving photos in real time
- **PictureMe** combines face-match AI, persistent account identity, private event access, and a low-friction QR entry point in one experience, with an explicit opt-out path at face enrollment

---

## Two user types

| Role | Can do |
|---|---|
| **Event creator / admin** | Create events, generate QR code, manage members, grant or revoke admin, upload photos |
| **Event member** | View My Photos if face profile completed, view All Photos, download photos |

---

## Key product decisions

| Decision | Reasoning |
|---|---|
| Sign-in required to view gallery | Protects event privacy so photos are not publicly accessible to anyone with a link |
| Face profile optional at signup | Lowers friction for users who do not want facial recognition, while still giving them full gallery access |
| No face profile = no My Photos | Honest and clear — opting out means manual browsing only |
| 30-day gallery expiry | Manages storage costs at scale and keeps the retention policy simple |
| Persistent face profile across events | Users enroll once using 3–5 selfies, and the backend can reuse that profile to search each event collection later |
| Enrollment selfies stored privately | Sensitive face-profile images live in a private Supabase Storage bucket, while event photos live in Cloudinary for gallery delivery |
