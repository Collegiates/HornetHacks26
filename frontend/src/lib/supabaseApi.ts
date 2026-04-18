import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type {
  AccountResponse,
  AllPhotosResponse,
  DashboardResponse,
  EventDetail,
  EventMember,
  EventRole,
  EventSummary,
  MyPhotosResponse,
  Photo,
} from "../types";
import { normalizePhoto } from "./normalizers";

type ApiBody = FormData | string | null | undefined;

interface SupabaseApiRequest {
  body?: ApiBody;
  method?: string;
}

interface PublicUserRow {
  avatar_url: string | null;
  email: string;
  face_indexed_at: string | null;
  id: string;
  name: string;
}

interface EventRow {
  cover_url: string | null;
  created_at: string;
  creator?: { id: string; name: string } | Array<{ id: string; name: string }> | null;
  creator_id: string;
  date: string;
  description: string | null;
  expires_at: string;
  id: string;
  join_token: string;
  name: string;
  status: "active" | "expired";
}

export async function handleSupabaseApiRequest<T>(
  path: string,
  options: SupabaseApiRequest = {},
) {
  const method = (options.method ?? "GET").toUpperCase();

  if (path === "/api/dashboard" && method === "GET") {
    return (await getDashboard()) as T;
  }

  if (path === "/api/account" && method === "GET") {
    return (await getAccount()) as T;
  }

  if (path === "/api/account/profile" && method === "PATCH") {
    return (await updateAccountProfile(options.body)) as T;
  }

  if (path === "/api/account/face-profile" && method === "DELETE") {
    return (await deleteFaceProfile()) as T;
  }

  if (path === "/api/events" && method === "POST") {
    return (await createEvent(options.body)) as T;
  }

  const eventMembersMatch = path.match(/^\/api\/events\/([^/]+)\/members\/([^/]+)$/);
  if (eventMembersMatch && method === "PATCH") {
    return (await updateEventMemberRole(
      eventMembersMatch[1],
      eventMembersMatch[2],
      options.body,
    )) as T;
  }

  const eventMembersListMatch = path.match(/^\/api\/events\/([^/]+)\/members$/);
  if (eventMembersListMatch && method === "GET") {
    return (await getEventMembers(eventMembersListMatch[1])) as T;
  }

  const eventPhotosMatch = path.match(/^\/api\/events\/([^/]+)\/photos$/);
  if (eventPhotosMatch && method === "GET") {
    return (await getEventPhotos(eventPhotosMatch[1])) as T;
  }

  const eventMyPhotosMatch = path.match(/^\/api\/events\/([^/]+)\/my-photos$/);
  if (eventMyPhotosMatch && method === "GET") {
    return (await getMyPhotos(eventMyPhotosMatch[1])) as T;
  }

  const eventMatch = path.match(/^\/api\/events\/([^/]+)$/);
  if (eventMatch && method === "GET") {
    return (await getEventDetail(eventMatch[1])) as T;
  }

  if (eventMatch && method === "PATCH") {
    return (await updateEvent(eventMatch[1], options.body)) as T;
  }

  if (eventMatch && method === "DELETE") {
    return (await deleteEvent(eventMatch[1])) as T;
  }

  throw new Error(
    "This website route still needs the backend service. The authenticated Supabase connection is live, but this action has not been moved off `/api` yet.",
  );
}

async function getDashboard(): Promise<DashboardResponse> {
  const user = await requirePublicUser();
  const [createdEvents, memberships] = await Promise.all([
    listEventsByCreator(user.id),
    listMembershipEventIds(user.id),
  ]);

  const joinedEventIds = memberships.filter((eventId) =>
    createdEvents.every((event) => event.id !== eventId),
  );
  const joinedEvents = joinedEventIds.length
    ? await listEventsByIds(joinedEventIds)
    : [];
  const summaries = await mapEventSummaries(user.id, [...createdEvents, ...joinedEvents]);

  return {
    user: mapAuthUser(user),
    createdEvents: summaries.filter((event) => event.role === "creator"),
    joinedEvents: summaries.filter((event) => event.role !== "creator"),
  };
}

async function getAccount(): Promise<AccountResponse> {
  const user = await requirePublicUser();
  return {
    user: {
      ...mapAuthUser(user),
      faceIndexedAt: user.face_indexed_at ?? undefined,
    },
  };
}

async function updateAccountProfile(body?: ApiBody): Promise<AccountResponse> {
  const user = await requirePublicUser();
  const formData = readFormData(body);
  const name = formData.get("name");
  const avatar = formData.get("avatar");

  if (avatar instanceof File && avatar.size > 0) {
    throw new Error(
      "Avatar uploads still need the backend media pipeline. Name updates are connected to Supabase now.",
    );
  }

  if (typeof name !== "string" || !name.trim()) {
    throw new Error("A profile name is required.");
  }

  const { error } = await supabase
    .from("users")
    .update({ name: name.trim() })
    .eq("id", user.id);

  if (error) {
    throw error;
  }

  return getAccount();
}

async function deleteFaceProfile() {
  const user = await requireCurrentUser();
  const { error } = await supabase
    .from("users")
    .update({
      face_indexed_at: null,
      rekognition_face_id: null,
    })
    .eq("id", user.id);

  if (error) {
    throw error;
  }

  return { hasFaceProfile: false };
}

async function createEvent(body?: ApiBody) {
  const user = await requireCurrentUser();
  const formData = readFormData(body);
  const name = readRequiredFormValue(formData, "name");
  const date = readRequiredFormValue(formData, "date");
  const description = readOptionalFormValue(formData, "description");
  const cover = formData.get("cover");

  if (cover instanceof File && cover.size > 0) {
    throw new Error(
      "Cover photo uploads still need the backend media pipeline. Event records are connected to Supabase now.",
    );
  }

  const expiresAt = new Date(`${date}T23:59:59Z`);
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { data, error } = await supabase
    .from("events")
    .insert({
      creator_id: user.id,
      date,
      description,
      expires_at: expiresAt.toISOString(),
      name,
      rekognition_collection_id: `event-${crypto.randomUUID()}`,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw error ?? new Error("PictureMe could not create the event.");
  }

  return { id: data.id };
}

async function getEventDetail(eventId: string): Promise<EventDetail> {
  const user = await requireCurrentUser();
  const event = await fetchEvent(eventId);
  const [allPhotosCount, myPhotosCount, memberCount, role] = await Promise.all([
    countRows("photos", { event_id: eventId }),
    countRows("user_photo_matches", { event_id: eventId, user_id: user.id }),
    countRows("event_members", { event_id: eventId }),
    getEventRole(eventId, user.id, event.creator_id),
  ]);

  return {
    id: event.id,
    name: event.name,
    description: event.description ?? undefined,
    date: event.date,
    expiresAt: event.expires_at,
    status: event.status,
    coverUrl: event.cover_url ?? undefined,
    joinToken: event.join_token,
    role,
    creator: normalizeCreator(event.creator, event.creator_id),
    counts: {
      allPhotos: allPhotosCount,
      myPhotos: myPhotosCount,
      members: memberCount,
    },
  };
}

async function getEventPhotos(eventId: string): Promise<AllPhotosResponse> {
  await requireCurrentUser();
  const { data, error } = await supabase
    .from("photos")
    .select("id, cloudinary_url, thumbnail_url, uploaded_at, face_count")
    .eq("event_id", eventId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    throw error;
  }

  return {
    photos: (data ?? []).map((record) =>
      normalizePhoto(record as Record<string, unknown>),
    ),
  };
}

async function getMyPhotos(eventId: string): Promise<MyPhotosResponse> {
  const user = await requirePublicUser();
  const { data, error } = await supabase
    .from("user_photo_matches")
    .select(
      "matched_at, similarity_score, photo:photos!user_photo_matches_photo_id_fkey(id, cloudinary_url, thumbnail_url, uploaded_at, face_count)",
    )
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .order("matched_at", { ascending: false });

  if (error) {
    throw error;
  }

  return {
    photos: (data ?? [])
      .map((record) => {
        const photo = getNestedRecord(record, "photo");
        if (!photo) {
          return null;
        }

        return {
          ...normalizePhoto(photo),
          matchedAt: readOptionalString(record, "matched_at"),
          similarityScore: readOptionalNumber(record, "similarity_score"),
        };
      })
      .filter((record): record is NonNullable<typeof record> => Boolean(record)),
    hasFaceProfile: Boolean(user.face_indexed_at),
  };
}

async function getEventMembers(eventId: string): Promise<EventMember[]> {
  await requireCurrentUser();
  const { data, error } = await supabase
    .from("event_members")
    .select(
      "id, user_id, role, joined_at, user:users!event_members_user_id_fkey(id, name, email, avatar_url)",
    )
    .eq("event_id", eventId)
    .order("joined_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((record) => {
      const memberUser = getNestedRecord(record, "user");
      if (!memberUser) {
        return null;
      }

      return {
        id: readRequiredString(record, "id"),
        userId: readRequiredString(record, "user_id"),
        name: readRequiredString(memberUser, "name"),
        email: readRequiredString(memberUser, "email"),
        role: readEventRole(record, "role"),
        joinedAt: readRequiredString(record, "joined_at"),
        avatarUrl: readOptionalString(memberUser, "avatar_url"),
      } satisfies EventMember;
    })
    .filter((member): member is EventMember => Boolean(member));
}

async function updateEvent(eventId: string, body?: ApiBody): Promise<EventDetail> {
  await requireCurrentUser();
  const payload = readJsonBody<{ date?: string; description?: string; name?: string }>(body);
  const updatePayload = {
    ...(payload.date ? { date: payload.date } : {}),
    ...(typeof payload.description === "string" ? { description: payload.description } : {}),
    ...(payload.name ? { name: payload.name } : {}),
  };

  const { error } = await supabase.from("events").update(updatePayload).eq("id", eventId);
  if (error) {
    throw error;
  }

  return getEventDetail(eventId);
}

async function deleteEvent(eventId: string) {
  await requireCurrentUser();
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) {
    throw error;
  }

  return undefined;
}

async function updateEventMemberRole(eventId: string, userId: string, body?: ApiBody) {
  await requireCurrentUser();
  const payload = readJsonBody<{ role?: "admin" | "member" }>(body);
  if (payload.role !== "admin" && payload.role !== "member") {
    throw new Error("A valid member role is required.");
  }

  const { error } = await supabase
    .from("event_members")
    .update({ role: payload.role })
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return { success: true };
}

async function requireCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("You need to sign in before continuing.");
  }

  return user;
}

async function requirePublicUser() {
  const user = await requireCurrentUser();
  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, avatar_url, face_indexed_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Your PictureMe profile is not ready yet. Please sign out and sign back in.");
  }

  return data as PublicUserRow;
}

async function listEventsByCreator(userId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, name, description, date, expires_at, status, join_token, cover_url, creator_id, created_at, creator:users!events_creator_id_fkey(id, name)",
    )
    .eq("creator_id", userId)
    .order("date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as EventRow[];
}

async function listMembershipEventIds(userId: string) {
  const { data, error } = await supabase
    .from("event_members")
    .select("event_id")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row) => readOptionalString(row as Record<string, unknown>, "event_id"))
    .filter((eventId): eventId is string => Boolean(eventId));
}

async function listEventsByIds(eventIds: string[]) {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, name, description, date, expires_at, status, join_token, cover_url, creator_id, created_at, creator:users!events_creator_id_fkey(id, name)",
    )
    .in("id", eventIds)
    .order("date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as EventRow[];
}

async function mapEventSummaries(userId: string, events: EventRow[]) {
  const eventIds = events.map((event) => event.id);
  const [photos, members, matches, roles] = await Promise.all([
    listRows("photos", "event_id", eventIds),
    listRows("event_members", "event_id", eventIds),
    listRows("user_photo_matches", "event_id", eventIds, { user_id: userId }),
    getEventRoles(eventIds, userId),
  ]);

  return events.map((event) => {
    const role = event.creator_id === userId ? "creator" : roles.get(event.id) ?? "member";
    return {
      id: event.id,
      name: event.name,
      date: event.date,
      coverUrl: event.cover_url ?? undefined,
      hostName: normalizeCreator(event.creator, event.creator_id).name,
      photoCount: photos.get(event.id) ?? 0,
      memberCount: members.get(event.id) ?? 0,
      myPhotosCount: matches.get(event.id) ?? 0,
      daysRemaining: getDaysRemainingFromTimestamp(event.expires_at),
      status: event.status,
      role,
    } satisfies EventSummary;
  });
}

async function fetchEvent(eventId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, name, description, date, expires_at, status, join_token, cover_url, creator_id, created_at, creator:users!events_creator_id_fkey(id, name)",
    )
    .eq("id", eventId)
    .single();

  if (error || !data) {
    throw error ?? new Error("PictureMe could not load this event.");
  }

  return data as EventRow;
}

async function getEventRole(eventId: string, userId: string, creatorId: string): Promise<EventRole> {
  if (creatorId === userId) {
    return "creator";
  }

  const roles = await getEventRoles([eventId], userId);
  return roles.get(eventId) ?? "member";
}

async function getEventRoles(eventIds: string[], userId: string) {
  if (!eventIds.length) {
    return new Map<string, EventRole>();
  }

  const { data, error } = await supabase
    .from("event_members")
    .select("event_id, role")
    .eq("user_id", userId)
    .in("event_id", eventIds);

  if (error) {
    throw error;
  }

  return new Map(
    (data ?? []).map((row) => [
      readRequiredString(row as Record<string, unknown>, "event_id"),
      readEventRole(row as Record<string, unknown>, "role"),
    ]),
  );
}

async function listRows(
  table: "event_members" | "photos" | "user_photo_matches",
  key: string,
  eventIds: string[],
  filters: Record<string, string> = {},
) {
  if (!eventIds.length) {
    return new Map<string, number>();
  }

  let query = supabase.from(table).select(key).in(key, eventIds);
  for (const [filterKey, filterValue] of Object.entries(filters)) {
    query = query.eq(filterKey, filterValue);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const eventId = readOptionalString(row as Record<string, unknown>, key);
    if (!eventId) {
      continue;
    }

    counts.set(eventId, (counts.get(eventId) ?? 0) + 1);
  }

  return counts;
}

async function countRows(
  table: "event_members" | "photos" | "user_photo_matches",
  filters: Record<string, string>,
) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }

  const { count, error } = await query;
  if (error) {
    throw error;
  }

  return count ?? 0;
}

function mapAuthUser(user: PublicUserRow) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url ?? undefined,
    hasFaceProfile: Boolean(user.face_indexed_at),
  };
}

function normalizeCreator(
  creator: EventRow["creator"],
  creatorId: string,
): { id: string; name: string } {
  const creatorRecord = Array.isArray(creator) ? creator[0] : creator;
  return {
    id: creatorRecord?.id ?? creatorId,
    name: creatorRecord?.name ?? "PictureMe Host",
  };
}

function readFormData(body?: ApiBody) {
  if (body instanceof FormData) {
    return body;
  }

  throw new Error("PictureMe expected form data for this request.");
}

function readJsonBody<T>(body?: ApiBody) {
  if (typeof body !== "string" || !body.trim()) {
    return {} as T;
  }

  return JSON.parse(body) as T;
}

function readRequiredFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required field: ${key}`);
  }

  return value.trim();
}

function readOptionalFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getNestedRecord(record: unknown, key: string) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const value = (record as Record<string, unknown>)[key];
  if (Array.isArray(value)) {
    return value[0] && typeof value[0] === "object"
      ? (value[0] as Record<string, unknown>)
      : null;
  }

  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function readRequiredString(record: Record<string, unknown>, key: string) {
  const value = readOptionalString(record, key);
  if (!value) {
    throw new Error(`Missing required value: ${key}`);
  }

  return value;
}

function readOptionalString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readOptionalNumber(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "number" ? value : undefined;
}

function readEventRole(record: Record<string, unknown>, key: string): EventRole {
  const role = readOptionalString(record, key);
  if (role === "admin" || role === "member" || role === "creator") {
    return role;
  }

  return "member";
}

function getDaysRemainingFromTimestamp(value: string) {
  const eventEndTime = new Date(value).getTime();
  const currentTime = Date.now();
  return Math.max(0, Math.ceil((eventEndTime - currentTime) / 86_400_000));
}
