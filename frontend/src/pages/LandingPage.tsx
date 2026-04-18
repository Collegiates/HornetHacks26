import {
  ArrowRight,
  Camera,
  GraduationCap,
  Heart,
  QrCode,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const useCases = [
  { label: "Weddings", icon: Heart },
  { label: "Graduations", icon: GraduationCap },
  { label: "Conferences", icon: Users },
  { label: "Hackathons", icon: Sparkles },
  { label: "Sports Events", icon: Trophy },
];

const steps = [
  {
    title: "Organizer uploads event photos",
    body: "High-volume galleries land in PictureMe and start indexing immediately.",
    icon: Camera,
  },
  {
    title: "You scan a QR code and sign up",
    body: "Guests join from the event floor in a mobile-native flow that never loses context.",
    icon: QrCode,
  },
  {
    title: "PictureMe finds every photo you appear in",
    body: "Your personal gallery updates instantly while the full gallery stays one tab away.",
    icon: Sparkles,
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { startDemo } = useAuth();

  async function handleDemoLogin() {
    await startDemo();
    navigate("/dashboard");
  }

  return (
    <div className="page-shell space-y-16">
      <section className="surface-card overflow-hidden px-6 py-12 sm:px-10 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full bg-seafoam-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-seafoam-600">
              Photo delivery, redesigned
            </div>
            <div className="space-y-4">
              <h1 className="max-w-xl text-5xl leading-tight text-ink sm:text-6xl">
                PictureMe turns event galleries into a personal photo feed.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate">
                Join an event in seconds, optionally complete one face scan, and
                instantly see every photo you appear in alongside the full event
                gallery.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button" to="/signup">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link className="secondary-button" to="/login">
                Log in
              </Link>
              <button
                type="button"
                className="ghost-button justify-center rounded-full border border-ink/10 bg-white/70 px-5 py-3"
                onClick={() => void handleDemoLogin()}
              >
                Continue with demo
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="surface-card relative mx-auto max-w-sm overflow-hidden rounded-[40px] border-white/80 bg-white/90 p-4">
              <div className="rounded-[32px] bg-gradient-to-br from-ink via-slate to-seafoam-600 p-5 text-white">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/60">
                  <span>My Photos</span>
                  <span>Live</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((value) => (
                    <div
                      key={value}
                      className="aspect-square rounded-[24px] bg-white/15 backdrop-blur"
                    />
                  ))}
                </div>
                <div className="mt-4 rounded-[24px] bg-white/10 p-4">
                  <p className="text-sm font-medium">All Photos</p>
                  <p className="mt-1 text-sm text-white/70">
                    Swipe through the full gallery whenever you want more.
                  </p>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-300/60 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-seafoam-500">
            How it works
          </p>
          <h2 className="text-4xl text-ink">Three steps from upload to instant discovery</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ title, body, icon: Icon }, index) => (
            <article key={title} className="surface-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-seafoam-50 text-seafoam-500">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-slate/60">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-2xl text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-seafoam-500">
              Built for real events
            </p>
            <h2 className="mt-3 text-4xl text-ink">PictureMe fits every crowded gallery</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate">
            Weddings, graduations, conferences, hackathons, and sports events all
            generate more photos than people have time to search manually.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {useCases.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="rounded-[28px] border border-ink/10 bg-white/80 px-4 py-5 text-center"
            >
              <Icon className="mx-auto h-6 w-6 text-seafoam-500" />
              <p className="mt-3 text-sm font-medium text-ink">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-6 text-sm text-slate sm:flex-row">
        <p>PictureMe makes photo delivery feel instant.</p>
        <div className="flex items-center gap-4">
          <Link to="/signup">Sign up</Link>
          <Link to="/login">Log in</Link>
        </div>
      </footer>
    </div>
  );
}
