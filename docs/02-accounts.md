# PictureMe — accounts & authentication

## Sign-up flow (new user — direct)

### Step 1 — Create account
Standard signup: name, email, password. Or use Google OAuth for one-tap signup. Supabase Auth handles this out of the box.

**APIs:** Supabase Auth (`signUp()`), Google OAuth (optional)

### Step 2 — Face scan (optional)
After account creation, the user is prompted to complete their face profile.

- A selfie is captured using the browser camera (`getUserMedia` API)
- The selfie is sent to AWS Rekognition, which creates a `FaceId` tied to this user's account
- This `FaceId` persists across all future events — no re-scan needed

**The user can choose "Skip for now" to create their account without a face scan.**

If skipped:
- Account is created successfully
- The user sees a banner on event galleries: *"Complete your face profile to see your photos automatically"*
- They can complete the face scan from their account settings at any time

**APIs:** `getUserMedia` Web API, AWS Rekognition `IndexFaces`, Supabase `users` table

### Step 3 — Dashboard
User lands on their dashboard: events they've joined or created, and a prompt to create or join an event.

---

## Sign-up flow (new user — via QR code or invite link)

### Step 1 — Scan QR or open link
Browser opens `pictureme.app/join/[eventToken]`. Page shows the event name, host, and a preview. Two options: **Log in** or **Create account**.

### Step 2 — Create account inline
Signup form appears on the same page — name, email, password. No redirect away from the join flow.

After account creation, the user is immediately prompted to do the face scan before joining the event.

**Face scan is optional here too** — tapping "Skip" creates the account and adds them to the event as a member with no face profile.

**APIs:** Supabase Auth `signUp()`

### Step 3 — Face scan → join event
- If completed: user is added to the event as a member and immediately matched against all uploaded photos
- If skipped: user is added to the event as a member, can browse All Photos only

**APIs:** AWS Rekognition `SearchFacesByImage`, Supabase `event_members` INSERT

### Step 4 — Existing user login
If the user already has an account, they log in and are added to the event instantly — no face re-scan needed. Their existing `FaceId` is used to match them against the event's photo set automatically.

**APIs:** Supabase Auth `signIn()`, Rekognition uses stored `FaceId`

---

## Face scan opt-out — behavior summary

| Has face scan | My Photos tab | All Photos tab |
|---|---|---|
| Yes | Shows matched photos | Shows all event photos |
| No (opted out) | Empty — shows prompt to complete face profile | Shows all event photos |

---

## Adding or updating face scan later

Users who opted out can complete their face profile at any time:
1. Go to **Account Settings → Face Profile**
2. Take a new selfie
3. PictureMe re-runs matching across all events they are a member of
4. My Photos populates retroactively for all past events (within their 30-day expiry window)

**APIs:** Rekognition `IndexFaces` (create new FaceId), Rekognition `SearchFaces` (batch re-match across all user's events)

---

## Security notes

- Face embeddings are stored in AWS Rekognition — not in the PictureMe database directly
- Only the `rekognition_face_id` string is stored in Supabase — this is a reference ID, not biometric data itself
- Users can delete their face profile from account settings at any time, which calls Rekognition `DeleteFaces` and removes all matches from `user_photo_matches`
- Supabase Row Level Security (RLS) ensures users can only read their own records
