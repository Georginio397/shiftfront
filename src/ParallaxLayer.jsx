import { useEffect, useRef } from "react";
import { isParallaxDisabled } from "../performanceController";

export default function ParallaxLayer({
  src,
  speed = 0.02,
  invert = false,
  className = ""
}) {
  const ref = useRef(null);

  useEffect(() => {
    function move(e) {
      // ❄️ oprit complet când jocul e activ
      if (isParallaxDisabled()) return;

      let x = (e.clientX - window.innerWidth / 2) * speed;
      let y = (e.clientY - window.innerHeight / 2) * speed;

      if (invert) {
        x = -x;
        y = -y;
      }

      // ✅ direct DOM transform — ZERO re-render
      ref.current.style.transform =
        `translate(${x}px, ${y}px) scale(1.05)`;
    }

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [speed, invert]);

  return (
    <img
      ref={ref}
      src={src}
      className={`parallax-layer ${className}`}
      alt=""
    />
  );
}
