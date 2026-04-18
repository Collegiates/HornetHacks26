import { Chrome } from "lucide-react";
import { useState } from "react";
import { signInWithGoogleOAuth } from "../lib/oauth";

interface GoogleAuthButtonProps {
  className?: string;
  label: string;
  redirectPath?: string;
  onError?: (message: string) => void;
}

export function GoogleAuthButton({
  className,
  label,
  redirectPath,
  onError,
}: GoogleAuthButtonProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleClick() {
    setSubmitting(true);
    onError?.("");

    try {
      await signInWithGoogleOAuth(redirectPath);
    } catch (requestError) {
      setSubmitting(false);
      onError?.(
        requestError instanceof Error
          ? requestError.message
          : "PictureMe could not start Google sign-in.",
      );
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => void handleClick()}
      disabled={submitting}
    >
      <Chrome className="mr-2 h-4 w-4" />
      {submitting ? "Redirecting to Google..." : label}
    </button>
  );
}
