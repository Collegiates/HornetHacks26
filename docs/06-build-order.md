# PictureMe — build order & team roles

## Priority 1 — Core MVP (hours 0–12)

These features must work before anything else is touched. The entire product is non-functional without them.

| Priority | Feature | Who |
|---|---|---|
| 1 | Supabase project setup — tables, RLS policies, Auth enabled, private storage bucket for enrollment selfies | Backend |
| 2 | Supabase Auth — email signup, login, and Google OAuth | Backend |
| 3 | Face profile onboarding — `getUserMedia` + capture 3–5 selfies + upload to private Supabase Storage | Fullstack |
| 4 | Face profile opt-out — "Skip" flow that creates account without a face profile | Fullstack |
| 5 | Create event — event form + Rekognition `CreateCollection` + join link + QR code | Backend |
| 6 | Join event via QR/link — login or signup inline → `event_members` INSERT | Fullstack |
| 7 | Photo upload (admin only) — Cloudinary upload + Rekognition `IndexFaces` per photo | Backend |
| 8 | Matching pipeline — on join and on upload, `SearchFacesByImage`, then write to `user_photo_matches` | Backend |
| 9 | Event gallery page — **My Photos** tab + **All Photos** tab, photo grid, download | Frontend |


---

## Priority 2 — Polish (hours 12–20)

Build these only once Priority 1 is fully working end to end.

| Priority | Feature | Who |
|---|---|---|
| 10 | User dashboard — events joined + created, photo counts, expiry badges | Frontend |
| 11 | Admin management — creator can promote or demote members | Frontend + Backend |
| 12 | Real-time updates — Supabase subscription updates My Photos count and All Photos grid live | Frontend |
| 13 | Gallery expiry banner — countdown shown when fewer than 14 days remain | Frontend |
| 14 | Landing page — product description, how it works, sign up CTA | Design |
| 15 | Upload progress UI — "47 of 94 photos indexed" progress bar | Frontend |
| 16 | Empty states — no photos yet, no matches found, gallery expired | Design + Frontend |
| 17 | Account settings — view, replace, or delete face profile | Fullstack |

---

## Cut completely — out of scope for hackathon

| Feature | Reason |
|---|---|
| SMS or email notifications on match | Accounts + real-time updates already cover the key feedback loop |
| Native mobile app | Responsive web handles everything |
| Photo editing, watermarking, or print ordering | Out of scope |
| In-app messaging or comments | Out of scope |
| Payment processing or paid tiers | Out of scope |
| Automated model training or fine-tuning | Rekognition is used as a managed service |
| Nightly cleanup cron job polish | Manual trigger is enough for the hackathon demo if needed |

---

## Team split

### Person 1 — Backend lead
- Supabase schema + RLS policies
- FastAPI routers and dependencies
- AWS Rekognition integration (`IndexFaces`, `SearchFacesByImage`, `CreateCollection`)
- Cloudinary upload pipeline
- Matching pipeline logic on join + on upload
- Railway or Render deployment

### Person 2 — Frontend lead
- React app scaffold + Vite setup
- React Router — all routes
- Event gallery page with My Photos + All Photos tabs
- Photo grid UI, full-size photo modal, download button
- Supabase real-time subscriptions in the gallery

### Person 3 — Fullstack + integration
- Auth flows (signup, login, Google OAuth)
- Join-via-QR page with inline signup or login
- Face profile onboarding UI (camera capture, opt-out flow, 3–5 selfies)
- Account settings page for face profile management
- Connect frontend to backend and handle integration testing
- Vercel deployment

### Person 4 — Design + pitch
- Tailwind component system (cards, buttons, tabs, badges)
- Landing page
- User dashboard
- Event creation flow UI
- Upload progress UI + empty states
- Expiry countdown banner
- Demo prep — seed fake event with real photos of the team
- 4-slide pitch deck

---

## The matching pipeline in detail

This is the technical core of the product. Get this working first.

```
On user joins event (has face profile):
  1. GET event.rekognition_collection_id from Supabase
  2. GET the user's 3–5 enrollment selfie files from the private Supabase bucket
  3. For each enrollment selfie, call Rekognition SearchFacesByImage(collectionId, imageBytes, threshold=80)
  4. Collect returned { FaceId, Similarity } matches
  5. Map each FaceId → photo_id via the face_index table
  6. De-duplicate photo_ids and keep the highest similarity score per photo
  7. INSERT into user_photo_matches (user_id, photo_id, event_id, similarity_score)
  8. Supabase real-time fires and My Photos updates

On admin uploads new photos:
  1. For each photo:
     a. Upload to Cloudinary → cloudinary_url
     b. Call Rekognition IndexFaces(imageBytes, collectionId)
     c. INSERT face_index rows for each detected face
     d. INSERT photo row in Supabase
  2. Fetch all event_members with completed face profiles
  3. For each member:
     a. Fetch that member's enrollment selfies
     b. Call SearchFacesByImage for each selfie against the same collection
     c. De-duplicate and INSERT new matches into user_photo_matches
  4. Supabase real-time fires and members' galleries update
```

Use background tasks so join and upload responses return quickly instead of waiting for all matching work to finish.

---

## Demo prep checklist (hours 20–24)

- [ ] Take 50–100 real photos of team members at the hackathon itself and use these as the demo event
- [ ] Create a demo event as the organizer account
- [ ] Upload photos and confirm indexing completes
- [ ] Create 2–3 attendee accounts with different email addresses
- [ ] Complete the face profile for each attendee and confirm My Photos populates correctly
- [ ] Deploy to Vercel (frontend) + Railway/Render (backend) and test the full pipeline on real phones
- [ ] Print the event QR code on paper for the live demo
- [ ] Rehearse the demo flow: judge scans QR → signs up → optional face profile → My Photos populates after matching
- [ ] Prepare Q&A answers

---

## Q&A prep

**"What about privacy and facial recognition?"**
It is completely opt-in. Users choose whether to complete the face profile and can skip it at signup. Enrollment selfies are stored in a private bucket and can be deleted from account settings at any time.

**"What if the face matching is wrong?"**
AWS Rekognition's similarity threshold is configurable. We default to 80% confidence and can support a simple "remove wrong match" action from My Photos.

**"What happens after 30 days?"**
Photos are deleted from storage and the gallery expires. Users see a countdown banner and are prompted to download their photos. Event metadata such as name, date, and members is retained.

**"Why require sign-in to view the gallery?"**
Event photos are private by default. Without authentication, anyone who found the link could view photos of people who did not consent to public access. Sign-in ensures only invited attendees can see galleries.

**"Can this scale beyond a hackathon demo?"**
Yes. Cloudinary can serve large photo volumes, Supabase handles app data and auth, and Rekognition handles face search as a managed service. The architecture is hackathon-friendly while still leaving room to harden later.
