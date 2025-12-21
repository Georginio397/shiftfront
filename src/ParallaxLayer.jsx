import { useEffect, useState } from "react";

export default function ParallaxLayer({ src, speed = 0.02, invert = false, className = "" }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      let x = (e.clientX - window.innerWidth / 2) * speed;
      let y = (e.clientY - window.innerHeight / 2) * speed;

      if (invert) {
        x = -x;
        y = -y;
      }

      setPos({ x, y });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [speed, invert]);

  return (
    <img
      src={src}
      className={`parallax-layer ${className}`}
      alt=""
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) scale(1.05)`,
      }}
    />
  );
}
