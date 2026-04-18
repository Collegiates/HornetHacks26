import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useScrollAnimation } from "./useScrollAnimation";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Wedding Planner",
    quote:
      "PictureMe transformed how we handle event photos. Our couples love instantly finding themselves in the gallery instead of scrolling forever.",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "Event Photographer",
    quote:
      "I upload the photos, and guests get notified when they appear. The engagement is incredible, and I get more referrals than ever.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Conference Organizer",
    quote:
      "At our 500-person conference, attendees found their photos in seconds. The QR code join was so smooth. Game changer.",
    rating: 5,
  },
];

export function LandingTestimonials() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </span>
          <h2 className="text-balance mt-4 text-3xl font-bold tracking-tight text-foreground lg:text-5xl">
            Loved by Event Organizers
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            See what planners, photographers, and organizers say about PictureMe
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative rounded-2xl border border-border bg-card p-8"
    >
      <Quote className="mb-6 h-10 w-10 text-primary/20" />

      <div className="mb-4 flex gap-1">
        {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
          <Star
            key={starIndex}
            className="h-5 w-5 fill-primary text-primary"
          />
        ))}
      </div>

      <p className="mb-8 leading-relaxed text-foreground">
        &quot;{testimonial.quote}&quot;
      </p>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-coffee-200 to-coffee-300">
          <span className="text-lg font-semibold text-coffee-700">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}
