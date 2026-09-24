import { useEffect, useMemo, useState } from "react";

type Star = {
  top: number;
  left: number;
  size: number;
  opacity: number;
  twinkleDur: number;
  twinkleDelay: number;
};

const STAR_COUNT = 60;

/** Fixed cosmic backdrop: subtle nebula wash + 60 small white stars
 *  that twinkle gently while the whole field drifts through space. */
export function Starfield() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: STAR_COUNT }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() < 0.85 ? 1 : 2,
        opacity: 0.2 + Math.random() * 0.5,
        twinkleDur: 4 + Math.random() * 6,
        twinkleDelay: Math.random() * 8,
      })),
    []
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {/* Subtle deep-blue nebula wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 72% 8%, rgba(45, 92, 180, 0.08), transparent 60%)," +
            "radial-gradient(60% 50% at 12% 88%, rgba(45, 92, 180, 0.05), transparent 55%)",
        }}
      />

      {/* Drifting star field — bleeds past the viewport so edges never show */}
      <div
        className="absolute"
        style={{
          inset: "-15%",
          animation: reduced ? undefined : "star-drift 160s linear infinite alternate",
        }}
      >
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              opacity: s.opacity,
            }}
          >
            <span
              className="block rounded-full bg-white"
              style={{
                width: s.size,
                height: s.size,
                animation: reduced
                  ? undefined
                  : `star-twinkle ${s.twinkleDur.toFixed(2)}s ease-in-out ${s.twinkleDelay.toFixed(2)}s infinite`,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
