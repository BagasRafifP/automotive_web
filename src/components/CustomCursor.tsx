import { useEffect, useRef, useState } from "react";

/** Subtle two-part cursor follower — active only on fine pointers (desktop). */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest("a, button, input, select, [role='button'], [data-cursor]"));
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent-hi"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[94] -ml-5 -mt-5 h-10 w-10 rounded-full border transition-[background-color,border-color,scale] duration-300 ${
          hovering ? "scale-125 border-accent/80 bg-accent/10" : "border-white/25"
        }`}
        style={{ transform: "translate(-100px, -100px)" }}
      />
    </>
  );
}
