import { AlertCircle, ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "../components/GoogleAuthButton";
import { getRedirectTarget } from "../lib/redirect";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTarget = getRedirectTarget(location.search);
  const { refreshSession, startDemo } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        throw signInError;
      }

      await refreshSession();
      navigate(redirectTarget, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "PictureMe could not log you in.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemoLogin() {
    setError(null);
    await startDemo();
    navigate(redirectTarget, { replace: true });
  }

  return (
    <div className="page-shell max-w-xl">
      <div className="surface-card p-6 sm:p-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-seafoam-500">
            Welcome back
          </p>
          <h1 className="text-4xl text-ink">Open your gallery</h1>
          <p className="text-sm leading-6 text-slate">
            Sign in to access your event dashboard, your matched photos, and any
            shared galleries waiting for you.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <GoogleAuthButton
            className="secondary-button w-full border-[#d9cdc1] bg-white"
            label="Continue with Google"
            redirectPath={redirectTarget}
            onError={setError}
          />

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e6d9cb]" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/70">
              Or with email
            </span>
            <div className="h-px flex-1 bg-[#e6d9cb]" />
          </div>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Email</span>
            <div className="field-shell">
              <input
                className="field-input"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((value) => ({ ...value, email: event.target.value }))
                }
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Password</span>
            <div className="field-shell">
              <input
                className="field-input"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((value) => ({ ...value, password: event.target.value }))
                }
                placeholder="Enter your password"
                required
              />
            </div>
          </label>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="ghost-button px-0 text-sm"
              onClick={() => setError("Password reset is not wired into this frontend yet.")}
            >
              Forgot password?
            </button>
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : null}

          <button type="submit" className="primary-button w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
            {!submitting ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
          </button>
        </form>

        <div className="mt-4 rounded-3xl bg-ivory/70 p-4">
          <p className="text-sm font-medium text-ink">Need a quick walkthrough?</p>
          <p className="mt-1 text-sm leading-6 text-slate">
            Launch a seeded demo account to browse PictureMe without logging in.
          </p>
          <button
            type="button"
            className="secondary-button mt-4 w-full"
            onClick={() => void handleDemoLogin()}
          >
            Continue with demo
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate">
          Don&apos;t have an account?{" "}
          <Link className="font-medium text-ink" to={`/signup${location.search}`}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
