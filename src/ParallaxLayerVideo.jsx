import { useEffect, useRef } from "react";
import { isParallaxDisabled } from "./performanceController";

export default function ParallaxLayerVideo({
  src,
  intensityX = 80,
  intensityY = 30,
  invertX = false,
  invertY = false,
  className = ""
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // ✅ setăm transform inițial (FOARTE IMPORTANT)
    video.style.transform = "translate(0px, 0px)";

    // salvăm sursa pentru unload / restore
    video.dataset.src = src;
    video.src = src;

    video.play().catch(() => {});
  }, [src]);

  useEffect(() => {
    function handleMouseMove(e) {
      const video = videoRef.current;
      if (!video) return;

      // ❄️ dacă e pauză, NU recalculăm, dar NU stricăm starea
      if (isParallaxDisabled()) return;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      const moveX =
        (invertX ? (x - 0.5) : -(x - 0.5)) * intensityX;
      const moveY =
        (invertY ? (y - 0.5) : -(y - 0.5)) * intensityY;

      video.style.transform =
        `translate(${moveX}px, ${moveY}px)`;
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [intensityX, intensityY, invertX, invertY]);

  return (
    <video
      ref={videoRef}
      className={`parallax-video ${className}`}
      autoPlay
      loop
      muted
      playsInline
      style={{
        transition: "transform 0.18s ease-out"
      }}
    />
  );
}
