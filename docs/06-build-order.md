# PictureMe — build order & team roles

## Priority 1 — Core MVP (hours 0–12)

These features must work before anything else is touched. The entire product is non-functional without them.

| Priority | Feature | Who |
|---|---|---|
| 1 | Supabase project setup — all 6 tables, RLS policies, Auth enabled | Backend |
| 2 | Supabase Auth — email signup + login (Google OAuth optional) | Backend |
| 3 | Face scan onboarding — `getUserMedia` + Rekognition `IndexFaces` + store `FaceId` | Fullstack |
| 4 | Face scan opt-out — "Skip" flow that creates account without face profile | Fullstack |
| 5 | Create event — event form + Rekognition `CreateCollection` + join link + QR code | Backend |
| 6 | Join event via QR / link — login or signup inline → `event_members` INSERT | Fullstack |
| 7 | Photo upload (admin only) — Cloudinary upload + Rekognition `IndexFaces` per photo | Backend |
| 8 | Matching pipeline — on join AND on upload, `SearchFaces`, write to `user_photo_matches` | Backend |
| 9 | Event gallery page — **My Photos** tab + **All Photos** tab, photo grid, download | Frontend |

---

## Priority 2 — Polish (hours 12–20)

Build these only once Priority 1 is fully working end-to-end.

| Priority | Feature | Who |
|---|---|---|
| 10 | User dashboard — events joined + created, photo counts, expiry badges | Frontend |
| 11 | Admin management — creator can promote/demote members | Frontend + Backend |
| 12 | Real-time updates — Supabase subscription → My Photos count + All Photos grid update live | Frontend |
| 13 | Gallery expiry banner — countdown shown when < 14 days remain | Frontend |
| 14 | Landing page — product description, how it works, sign up CTA | Design |
| 15 | Upload progress UI — "47 of 94 photos indexed" progress bar | Frontend |
| 16 | Empty states — no photos yet, no matches found, gallery expired | Design + Frontend |
| 17 | Account settings — view/update face profile, opt out / re-scan | Fullstack |

---

## Cut completely — out of scope for hackathon

| Feature | Reason |
|---|---|
| SMS / email notifications on match | Accounts + real-time updates make this redundant |
| Native mobile app | Responsive web handles everything |
| Photo editing, watermarking, or print ordering | Out of scope |
| In-app messaging or comments | Out of scope |
| Payment processing or paid tiers | Out of scope |
| Multiple face scans per user (glasses, masks) | Tune similarity threshold instead |
| Nightly cleanup cron job | Can simulate manually for demo; implement post-hackathon |

---

## Team split

### Person 1 — Backend lead
- Supabase schema + RLS policies
- All Express API endpoints
- AWS Rekognition integration (IndexFaces, SearchFaces, CreateCollection)
- Cloudinary upload pipeline
- Matching pipeline logic (on join + on upload)
- Railway/Render deployment

### Person 2 — Frontend lead
- React app scaffold + Vite setup
- React Router — all routes
- Event gallery page (My Photos + All Photos tabs)
- Photo grid UI, full-size photo modal, download button
- Supabase real-time subscriptions in the gallery

### Person 3 — Fullstack + integration
- Auth flows (signup, login, Google OAuth)
- Join-via-QR page (inline signup or login)
- Face scan onboarding UI (camera capture, opt-out flow)
- Account settings page (face profile management)
- Connects frontend to backend, integration testing
- Vercel deployment

### Person 4 — Design + pitch
- Tailwind component system (cards, buttons, tabs, badges)
- Landing page
- User dashboard
- Event creation flow UI
- Upload progress UI + empty states
- Expiry countdown banner
- Demo prep — seeds fake event with real photos of the team
- 4-slide pitch deck

---

## The matching pipeline in detail

This is the technical core of the product. Get this working first.

```
On user joins event (has face profile):
  1. GET user.rekognition_face_id from Supabase
  2. GET event.rekognition_collection_id from Supabase
  3. Call Rekognition SearchFaces(faceId, collectionId, threshold=80)
  4. Returns: array of { FaceId, Similarity }
  5. Map each FaceId → photo_id via face_index table
  6. INSERT into user_photo_matches (user_id, photo_id, event_id, similarity_score)
  7. Supabase real-time fires → My Photos tab updates

On admin uploads new photos:
  1. For each photo:
     a. Upload to Cloudinary → cloudinary_url
     b. Call Rekognition IndexFaces(imageBytes, collectionId)
     c. INSERT face_index rows for each detected face
     d. INSERT photo row in Supabase
  2. Fetch all event_members WHERE face profile exists
  3. For each member:
     a. Call Rekognition SearchFaces(member.faceId, collectionId)
     b. INSERT new matches into user_photo_matches
  4. Supabase real-time fires → all members' galleries update
```

---

## Demo prep checklist (hours 20–24)

- [ ] Take 50–100 real photos of team members at the hackathon itself — use these as the demo event
- [ ] Create a demo event as the organizer account
- [ ] Upload photos — confirm indexing completes
- [ ] Create 2–3 attendee accounts with different email addresses
- [ ] Complete face scan for each — confirm My Photos populates correctly
- [ ] Deploy to Vercel (frontend) + Railway (backend) — test full pipeline on real phones
- [ ] Print the event QR code on paper for the live demo
- [ ] Rehearse the demo flow: judge scans QR → signs up → face scan → My Photos shows their photo
- [ ] Prepare Q&A answers (see below)

---

## Q&A prep

**"What about privacy and facial recognition?"**
Completely opt-in — users choose to complete the face scan, and can skip it at signup. Facial data can be deleted from account settings at any time. No biometric data is stored in our database — only a Rekognition reference ID.

**"What if the face matching is wrong?"**
AWS Rekognition's similarity threshold is configurable. We default to 80% confidence. Users can report a wrong match with one tap, which removes it from their My Photos view.

**"What happens after 30 days?"**
Photos are deleted from storage and the gallery expires. Users see a countdown banner and are prompted to download their photos. Event metadata (name, date, members) is retained.

**"Why require sign-in to view the gallery?"**
Event photos are private by default. Without authentication, anyone who found the link could view photos of people who didn't consent to public access. Sign-in ensures only invited attendees can see the gallery.

**"Can this scale beyond a hackathon demo?"**
Yes. AWS Rekognition Face Collections scale to tens of millions of faces. Cloudinary handles any volume of photo delivery. Supabase Postgres handles high concurrency. The architecture is production-ready today.
