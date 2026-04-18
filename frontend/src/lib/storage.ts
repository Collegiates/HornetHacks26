const FAVORITES_KEY = "pictureme.favorite-event-ids";
const FACE_BANNER_KEY = "pictureme.face-banner-dismissed";

export function getFavoriteEventIds() {
  try {
    const value = window.localStorage.getItem(FAVORITES_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function setFavoriteEventIds(eventIds: string[]) {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(eventIds));
  } catch {
    // Local storage can be unavailable in private windows.
  }
}

export function getFaceBannerDismissed() {
  try {
    return window.localStorage.getItem(FACE_BANNER_KEY) === "true";
  } catch {
    return false;
  }
}

export function setFaceBannerDismissed(value: boolean) {
  try {
    window.localStorage.setItem(FACE_BANNER_KEY, String(value));
  } catch {
    // Local storage can be unavailable in private windows.
  }
}
