import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { buildRedirectParam } from "../lib/redirect";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "./Spinner";

interface ProtectedRouteProps {
  children?: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, session } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center">
        <Spinner label="Checking your session..." />
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        replace
        to={buildRedirectParam(location.pathname, location.search, location.hash)}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
