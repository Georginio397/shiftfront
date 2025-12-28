import { useState } from "react";
import Intro from "./Intro";
import LoadingScreen from "./LoadingScreen";
import ShiftRoom from "./ShiftRoom";
import PayoutModal from "./PayoutModal";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

// ============================
// FULLSCREEN WRAPPER
// ============================
const Fullscreen = ({ children }) => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      background: "#000"
    }}
  >
    {children}
  </div>
);

// ============================
// ASSET LIST (CRITICAL ONLY)
// ============================
const ASSETS = [
  "/back.webm",
  "/Wall.png",
  "/Front.png",
  "/Cup.png",
  "/Order.png",
  "/Shifter.gif",
  "/game.webm",
  "/mint.webm",
  "/About.webm"
];

// ============================
// PRELOAD FUNCTION
// ============================
function preloadAssets(list) {
  return Promise.all(
    list.map(src => {
      return new Promise(resolve => {
        if (src.endsWith(".webm") || src.endsWith(".mp4")) {
          const v = document.createElement("video");
          v.src = src;
          v.muted = true;
          v.onloadeddata = resolve;
          v.onerror = resolve;
        } else {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        }
      });
    })
  );
}

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [toast, setToast] = useState(null);

  // 💸 PAYOUT
  const [payoutPopup, setPayoutPopup] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE;
  const { width, height } = useWindowSize();

  // ============================
  // CHECK UNSEEN PAYOUT (ONCE)
  // ============================
  async function checkUnseenPayout() {
    const token = localStorage.getItem("shift_token");
    if (!API_BASE || !token) return;

    try {
      const res = await fetch(`${API_BASE}/api/my-unseen-payout`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();
      if (!data) return;

      setPayoutPopup({
        winnerId: data.winnerId,
        amount: data.amount,
        roundId: data.roundId
      });

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    } catch (err) {
      console.error("CHECK UNSEEN PAYOUT ERROR:", err);
    }
  }

  // ============================
  // INTRO
  // ============================
  if (phase === "intro") {
    return (
      <Fullscreen>
        <Intro
          onStart={async () => {
            setPhase("loading");
            await preloadAssets(ASSETS); // 🔥 AICI SE ÎNTÂMPLĂ MAGIA
            await checkUnseenPayout();
            setPhase("shift");
          }}
        />
      </Fullscreen>
    );
  }

  // ============================
  // LOADING (REAL)
  // ============================
  if (phase === "loading") {
    return (
      <Fullscreen>
        <LoadingScreen />
      </Fullscreen>
    );
  }

  // ============================
  // SHIFT SCENE
  // ============================
  return (
    <Fullscreen>
      <ShiftRoom onToast={setToast} />

      {/* 🎆 CONFETTI */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={700}
          gravity={0.25}
          initialVelocityY={20}
          recycle={false}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999999,
            pointerEvents: "none"
          }}
        />
      )}

      {/* 💸 PAYOUT MODAL */}
      {payoutPopup && (
        <PayoutModal
          payout={payoutPopup}
          onClose={() => setPayoutPopup(null)}
        />
      )}

      {/* 🔔 TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 40,
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
          <div style={{ fontSize: 15, opacity: 0.9 }}>
            {toast.message}
          </div>
        </div>
      )}
    </Fullscreen>
  );
}
