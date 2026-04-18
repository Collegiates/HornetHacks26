# PictureMe — accounts & authentication

## Sign-up flow (new user — direct)

### Step 1 — Create account
Standard signup uses name, email, and password. Google OAuth is also supported for one-tap signup. Supabase Auth handles both.

**APIs:** Supabase Auth `signUp()`, Google OAuth

### Step 2 — Face profile enrollment (optional)
After account creation, the user is prompted to complete their face profile.

- The browser camera captures a **small guided set of 3–5 selfies**
- These enrollment selfies are uploaded to a **private Supabase Storage bucket**
- The backend records that the user has completed face enrollment
- These stored profile selfies are later used with Rekognition `SearchFacesByImage` against each event collection

**The user can choose "Skip for now" to create their account without a face profile.**

If skipped:
- Account is created successfully
- The user sees a banner on event galleries: *"Complete your face profile to see your photos automatically"*
- They can complete face enrollment from account settings at any time

**APIs:** `getUserMedia` Web API, Supabase Storage private bucket, FastAPI upload endpoint, Supabase `users` + `face_profile_images` tables

### Step 3 — Dashboard
The user lands on their dashboard, which shows events they have joined or created and prompts to create or join an event.

---

## Sign-up flow (new user — via QR code or invite link)

### Step 1 — Scan QR or open link
The browser opens `pictureme.app/join/[eventToken]`. The page shows the event name, host, and a preview. Two options appear: **Log in** or **Create account**.

### Step 2 — Create account inline
The signup form appears on the same page with no redirect away from the join flow.

After account creation, the user is immediately prompted to complete the face profile before joining the event.

**Face enrollment is optional here too** — tapping "Skip" creates the account and adds them to the event as a member with no face profile.

**APIs:** Supabase Auth `signUp()`, Google OAuth optional

### Step 3 — Face enrollment → join event
- If completed: the user is added to the event as a member and a background matching job starts against all already-indexed event photos
- If skipped: the user is added to the event as a member and can browse All Photos only

**APIs:** Rekognition `SearchFacesByImage`, FastAPI background task, Supabase `event_members` INSERT

### Step 4 — Existing user login
If the user already has an account, they log in and are added to the event instantly with no re-enrollment. If they already have a face profile, the backend starts a background match job for that event.

**APIs:** Supabase Auth `signIn()`, FastAPI join endpoint, Rekognition `SearchFacesByImage`

---

## Face profile opt-out — behavior summary

| Has face profile | My Photos tab | All Photos tab |
|---|---|---|
| Yes | Populates after matching completes | Shows all event photos |
| No (opted out) | Empty — shows prompt to complete face profile | Shows all event photos |

---

## Adding or updating the face profile later

Users who opted out can complete their face profile at any time:
1. Go to **Account Settings → Face Profile**
2. Capture a new set of 3–5 selfies
3. The backend stores the new enrollment set and clears the old one
4. PictureMe re-runs matching across all active events the user belongs to
5. My Photos populates retroactively for all past active events within the 30-day expiry window

**APIs:** FastAPI upload endpoint, Supabase Storage private bucket, Rekognition `SearchFacesByImage`, background matching job

---

## Security notes

- Enrollment selfies are stored in a **private** Supabase Storage bucket, not in public gallery storage
- Event photos are stored separately in Cloudinary because they need fast delivery, transformations, and gallery-friendly URLs
- The app stores face-profile metadata and storage references in Supabase, not raw facial embeddings
- Users can delete their face profile at any time, which removes enrollment images and clears their existing match rows
- Supabase Row Level Security ensures users can only read their own account records and their own match records
