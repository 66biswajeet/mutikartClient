"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  end = 0,
  duration = 1500,
  suffix = "",
}) {
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let obs = null;
    let mounted = true;

    const animate = () => {
      if (!mounted || hasAnimated) return;
      setHasAnimated(true);
      const start = performance.now();
      const from = 0;

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.round(from + (end - from) * eased);
        setValue(current);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setValue(end);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    };

    const checkAndAnimate = () => {
      try {
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < vh * 0.9 && rect.bottom > 0) {
          animate();
          return true;
        }
      } catch (e) {
        // ignore
      }
      return false;
    };

    // run check in next animation frame to ensure layout is ready
    const rafCheck = requestAnimationFrame(() => {
      if (!checkAndAnimate()) {
        if (typeof IntersectionObserver !== "undefined") {
          obs = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) animate();
              });
            },
            { threshold: 0.25 }
          );
          obs.observe(node);
        } else {
          setTimeout(() => {
            if (!hasAnimated) animate();
          }, 200);
        }
      }
    });

    return () => {
      mounted = false;
      if (obs && node) obs.unobserve(node);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(rafCheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
