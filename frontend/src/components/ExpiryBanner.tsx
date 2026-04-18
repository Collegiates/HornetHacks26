import { AlertTriangle } from "lucide-react";
import { formatLongDate } from "../lib/date";

interface ExpiryBannerProps {
  expiresAt: string;
  daysRemaining: number;
}

export function ExpiryBanner({ expiresAt, daysRemaining }: ExpiryBannerProps) {
  if (daysRemaining <= 0 || daysRemaining >= 14) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-3xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-500">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <p>
        This gallery expires on {formatLongDate(expiresAt)}. Download your photos
        before then.
      </p>
    </div>
  );
}
