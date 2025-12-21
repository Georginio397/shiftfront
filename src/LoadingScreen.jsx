import { useState, useEffect, useRef } from "react";
import "./loading.css";

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const realLoaded = useRef(false);
  const animationDone = useRef(false);

  /* ============================
     1) SIMULATED PROGRESS (0 → 100)
     ============================ */
  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += 2; // speed
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        animationDone.current = true;

        // dacă și fișierele sunt gata → intră în ShiftRoom
        if (realLoaded.current) {
          setTimeout(onLoaded, 300);
        }
      }
    }, 20); // ~1s total

    return () => clearInterval(interval);
  }, []);

  /* ============================
     2) REAL FILE PRELOADING
     ============================ */
  useEffect(() => {
    const assets = [
      "/Wall.png",
      "/Front.png",
      "/Shifter.gif",
      "/Back.webm",
      "/About.webm",
      "/AboutHover.webm",
      "/play.webm",
      "/game.webm",
      "/mint.webm",
      "/minthover.webm"
    ];

    let loaded = 0;

    const checkDone = () => {
      loaded++;
      if (loaded === assets.length) {
        realLoaded.current = true;

        // dacă animația e gata → intră în ShiftRoom
        if (animationDone.current) {
          setTimeout(onLoaded, 300);
        }
      }
    };

    assets.forEach((src) => {
      const isVideo = src.endsWith(".webm") || src.endsWith(".mp4");
      const el = isVideo ? document.createElement("video") : new Image();
      el.src = src;

      el.onload = el.onloadeddata = checkDone;
      el.onerror = checkDone;
    });
  }, []);

  return (
    <div className="loading-circle-container">
  
      {/* Cerc din puncte + procent în mijloc */}
      <div className="loading-ring">
  
        {/* DOTS */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`dot ${
              i < Math.floor((progress / 100) * 40) ? "active" : ""
            }`}
          ></div>
        ))}
  
        {/* 🔥 procentul trebuie să fie AICI ca să fie centrat corect */}
        <div className="loading-percent">{progress}%</div>
      </div>
  
      {/* Text sub cerc */}
      <div className="loading-text">Preparing your shift…</div>
    </div>
  );
  
}
