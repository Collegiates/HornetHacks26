import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getRedirectTarget } from "../lib/redirect";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "./Spinner";

interface PublicOnlyRouteProps {
  children?: ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { loading, session } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (session) {
    return <Navigate replace to={getRedirectTarget(location.search)} />;
  }

  return children ? <>{children}</> : <Outlet />;
}
