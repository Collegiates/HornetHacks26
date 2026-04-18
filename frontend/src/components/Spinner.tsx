import { cn } from "../lib/cn";

interface SpinnerProps {
  label?: string;
  className?: string;
}

export function Spinner({ label, className }: SpinnerProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-seafoam-100 border-t-seafoam-500" />
      {label ? <p className="text-sm text-slate">{label}</p> : null}
    </div>
  );
}
