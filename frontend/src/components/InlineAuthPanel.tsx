import { cn } from "../lib/cn";

interface InlineAuthPanelProps {
  mode: "signup" | "login";
  onModeChange: (mode: "signup" | "login") => void;
}

export function InlineAuthPanel({
  mode,
  onModeChange,
}: InlineAuthPanelProps) {
  return (
    <div className="surface-card p-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={cn(
            "tab-pill",
            mode === "signup"
              ? "bg-ink text-white"
              : "bg-transparent text-slate hover:bg-ink/5",
          )}
          onClick={() => onModeChange("signup")}
        >
          Create account
        </button>
        <button
          type="button"
          className={cn(
            "tab-pill",
            mode === "login"
              ? "bg-ink text-white"
              : "bg-transparent text-slate hover:bg-ink/5",
          )}
          onClick={() => onModeChange("login")}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
