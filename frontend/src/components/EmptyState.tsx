import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  cta?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  cta,
}: EmptyStateProps) {
  return (
    <div className="surface-card flex flex-col items-center gap-4 px-6 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-seafoam-50 text-seafoam-500">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl text-ink">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-slate">{description}</p>
      </div>
      {cta?.to ? (
        <Link className="primary-button" to={cta.to}>
          {cta.label}
        </Link>
      ) : cta?.onClick ? (
        <button type="button" className="primary-button" onClick={cta.onClick}>
          {cta.label}
        </button>
      ) : null}
    </div>
  );
}
