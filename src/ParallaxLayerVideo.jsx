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

    // salvăm sursa pentru restore după unload
    video.dataset.src = src;
    video.src = src;

    video.play().catch(() => {});
  }, [src]);

  useEffect(() => {
    function handleMouseMove(e) {
      // ❄️ oprit complet când jocul e activ
      if (isParallaxDisabled()) return;

      const x = e.clientX / window.innerWidth;   // 0 → 1
      const y = e.clientY / window.innerHeight;  // 0 → 1

      const moveX =
        (invertX ? (x - 0.5) : -(x - 0.5)) * intensityX;
      const moveY =
        (invertY ? (y - 0.5) : -(y - 0.5)) * intensityY;

      // ✅ transform direct pe DOM — ZERO re-render
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
