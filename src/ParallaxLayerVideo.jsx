import { useEffect, useState } from "react";

export default function ParallaxLayerVideo({
  src,
  intensityX = 80,   // cât se mișcă pe X
  intensityY = 30,   // cât se mișcă pe Y
  invertX = false,   // inversare orizontală
  invertY = false,   // inversare verticală
  className = ""
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  

  useEffect(() => {
    function handleMouseMove(e) {
      const x = e.clientX / window.innerWidth;   // 0 → 1
      const y = e.clientY / window.innerHeight;  // 0 → 1

      const moveX = (invertX ? (x - 0.5) : -(x - 0.5)) * intensityX;
      const moveY = (invertY ? (y - 0.5) : -(y - 0.5)) * intensityY;

      setOffset({ x: moveX, y: moveY });
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [intensityX, intensityY, invertX, invertY]);

  return (
    <video
      className={`parallax-video ${className}`}
      autoPlay
      loop
      muted
      playsInline
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.18s ease-out"
      }}
    >
      <source src={src} type="video/webm" />
    </video>
  );
}
