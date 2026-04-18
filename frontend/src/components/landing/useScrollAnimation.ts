import { useInView } from "framer-motion";
import { useRef } from "react";

export function useScrollAnimation(options?: { once?: boolean; amount?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    amount: options?.amount ?? 0.2,
  });

  return { ref, isInView };
}
