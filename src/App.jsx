import { useState } from "react";
import Intro from "./Intro";
import LoadingScreen from "./LoadingScreen";
import ShiftRoom from "./ShiftRoom";

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [toast, setToast] = useState(null);

  if (phase === "intro") {
    return <Intro onStart={() => setPhase("loading")} />;
  }

  if (phase === "loading") {
    return <LoadingScreen onLoaded={() => setPhase("shift")} />;
  }

  // 🔥 FAZA PRINCIPALĂ (SHIFT)
  return (
    <>
      <ShiftRoom onToast={setToast} />

      {/* 🔔 GLOBAL TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3a1f1f",
            border: "2px solid #ff4d4f",
            padding: "14px 18px",
            borderRadius: 8,
            color: "#ffd6d6",
            zIndex: 999999,
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
            maxWidth: "90vw",
            textAlign: "center"
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 6 }}>
            ⚠️ {toast.title}
          </div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
