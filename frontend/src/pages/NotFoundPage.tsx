import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface NotFoundPageProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  cta?: {
    label: string;
    to: string;
    icon?: ReactNode;
  };
}

export function NotFoundPage({
  icon,
  title = "Page not found",
  description = "The page you requested could not be found.",
  cta,
}: NotFoundPageProps) {
  return (
    <div className="page-shell max-w-2xl">
      <div className="surface-card flex flex-col items-center gap-4 p-10 text-center">
        {icon ? (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-seafoam-50 text-seafoam-500">
            {icon}
          </div>
        ) : null}
        <div className="space-y-2">
          <h1 className="text-4xl text-ink">{title}</h1>
          <p className="text-sm leading-6 text-slate">{description}</p>
        </div>
        {cta ? (
          <Link className="primary-button" to={cta.to}>
            {cta.icon}
            <span className={cta.icon ? "ml-2" : undefined}>{cta.label}</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
