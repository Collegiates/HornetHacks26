import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "./useScrollAnimation";

export function LandingCTA() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-coffee-700 via-coffee-800 to-coffee-900 py-24 lg:py-32">
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-coffee-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-cream" />
            <span className="text-sm font-medium text-cream">
              Free to get started
            </span>
          </div>

          <h2 className="text-balance text-3xl font-bold tracking-tight text-cream sm:text-4xl lg:text-6xl">
            Ready to Let Your Photos Find You?
          </h2>

          <p className="text-pretty mx-auto mt-6 max-w-2xl text-lg text-coffee-200 lg:text-xl">
            Join event organizers and attendees who&apos;ve discovered a better
            way to share and find event photos.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cream px-8 py-4 text-base font-semibold text-coffee-800 shadow-lg transition-all hover:scale-[1.02] hover:bg-cream/90 hover:shadow-xl"
            >
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cream/30 px-8 py-4 text-base font-semibold text-cream transition-all hover:bg-cream/10"
            >
              Learn More
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-sm text-coffee-300"
          >
            No credit card required. Private galleries for every event.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
