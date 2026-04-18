const shortFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const longFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function formatDate(value: string) {
  return shortFormatter.format(parseDate(value));
}

export function formatLongDate(value: string) {
  return longFormatter.format(parseDate(value));
}

export function getDaysRemaining(value: string) {
  const end = parseDate(value).getTime();
  const now = new Date().getTime();
  return Math.max(0, Math.ceil((end - now) / 86_400_000));
}

export function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "PM";
}

function parseDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`);
  }

  return new Date(value);
}
