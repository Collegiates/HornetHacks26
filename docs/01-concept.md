# PictureMe — concept overview

## What is PictureMe

PictureMe is an event photo platform where every user has a persistent account optionally tied to a face profile. When you attend any event on PictureMe, the platform already knows what you look like — so your photos find you automatically, without re-scanning at every event.

Organizers create events, generate a shareable QR code or link, and grant photo upload access to trusted collaborators (photographers, co-hosts). Attendees join via the QR code or link. Users who completed a face scan during signup will automatically see their matched photos under **My Photos**. Users who opted out of the face scan can still browse the full event gallery under **All Photos**.

**You must be signed in to view any event gallery.**

---

## The core problem

After every major event — a wedding, graduation ceremony, corporate conference, hackathon, sports tournament — a photographer delivers 500 to 3,000 photos to a shared Google Drive, Dropbox, or gallery link. Every attendee gets the same link. Finding yourself requires manually scrolling through the entire set, squinting at thumbnails, hoping you remember what you wore. Most people give up after a few minutes. Great photos go unseen. Photographers get less credit and fewer referrals. Organizers get no engagement data.

---

## The solution in three steps

1. Organizer creates an event and uploads photos
2. Attendee scans a QR code or opens the link → signs up or logs in
3. PictureMe shows them **My Photos** (their matched photos) and **All Photos** (the full gallery)

---

## What makes this different from anything existing

- **Google Photos** has "find photos of a person" — but only for your own photos in your own account
- **Facebook** auto-tags — but requires a Facebook account and has significant consent issues
- **Event photo apps** like Pic-Time and Sprout Studio are built for photographers to sell prints, not for attendees to self-serve in real time
- **PictureMe** is the only tool that combines face-match AI, persistent account identity, and a zero-friction QR entry point into a single experience — with a privacy-respecting opt-out at the face scan step

---

## Two user types

| Role | Can do |
|---|---|
| **Event creator / admin** | Create events, generate QR code, manage members, grant/revoke admin, upload photos |
| **Event member** | View My Photos (if face scan completed) + All Photos, download photos |

---

## Key product decisions

| Decision | Reasoning |
|---|---|
| Sign-in required to view gallery | Protects event privacy — photos aren't publicly accessible to anyone with a link |
| Face scan optional at signup | Lowers friction for users who don't want facial recognition, while still giving them full gallery access |
| No face scan = no My Photos | Honest and clear — opting out means manual browsing only |
| 30-day gallery expiry | Manages storage costs at scale; users are informed at upload time |
| Persistent FaceId across events | Scan once, matched forever — no re-scanning at each new event |
