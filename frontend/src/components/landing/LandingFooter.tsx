import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Gallery", href: "#gallery" },
  ],
  account: [
    { label: "Log in", to: "/login" },
    { label: "Sign up", to: "/signup" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="bg-coffee-900 text-coffee-100">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-8 lg:gap-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="group flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream/10 transition-colors group-hover:bg-cream/20">
                <Camera className="h-5 w-5 text-cream" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-cream">
                PictureMe
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-coffee-300">
              Event photo platform with AI-powered face matching. Your photos
              find you automatically.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">
              Product
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-coffee-300 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">
              Account
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.account.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-coffee-300 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-coffee-800 pt-8 sm:flex-row">
          <p className="text-sm text-coffee-400">
            &copy; {new Date().getFullYear()} PictureMe. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-coffee-400 transition-colors hover:text-cream"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-coffee-400 transition-colors hover:text-cream"
            >
              How It Works
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
