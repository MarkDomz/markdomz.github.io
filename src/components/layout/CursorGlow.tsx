import { memo, useEffect, useRef } from "react";

export const CursorGlow = memo(function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onMove = (event: MouseEvent) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ref.current?.style.setProperty("--x", `${event.clientX}px`);
        ref.current?.style.setProperty("--y", `${event.clientY}px`);
        ticking = false;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return <div ref={ref} className="pointer-events-none fixed inset-0 z-50 cursor-glow hidden md:block" aria-hidden="true" />;
});
