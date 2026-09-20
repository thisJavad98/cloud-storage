"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals children with a fade/slide animation when scrolled into view.
 */
export default function Reveal({
  as: Comp = "div",
  delay = 0,
  className = "",
  children,
  once = true,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { style, className: _ignored, ...other } = rest;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Comp
      ref={ref}
      className={`reveal-item${visible ? " is-visible" : ""} ${className}`}
      style={{
        ...(style || {}),
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
      {...other}
    >
      {children}
    </Comp>
  );
}
