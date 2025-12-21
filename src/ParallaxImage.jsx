import { useEffect, useState } from "react";

export default function ParallaxImage({ src }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      // Calculăm offset în funcție de poziția mouse-ului
      const x = (e.clientX - window.innerWidth / 2) * 0.02;
      const y = (e.clientY - window.innerHeight / 2) * 0.02;
      setPos({ x, y });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <img
      src={src}
      alt=""
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`,

        /* 
          Height 100% menține toată imaginea vizibilă pe înălțime,
          fără crop, fără să dispară părți din ea.
        */
        width: "auto",
        height: "100%",
        objectFit: "contain",

        pointerEvents: "none",
        zIndex: 5
      }}
    />
  );
}
