import { useState, useEffect } from "react";
import Intro from "./Intro";
import LoadingScreen from "./LoadingScreen";
import ShiftRoom from "./ShiftRoom";
import PayoutModal from "./PayoutModal";

const Fullscreen = ({ children }) => (
  <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
    {children}
  </div>
);

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [toast, setToast] = useState(null);
  const [payoutPopup, setPayoutPopup] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE;

  // =================================================
  // 🔥 CHECK UNSEEN PAYOUT (O SINGURĂ DATĂ)
  // =================================================
  useEffect(() => {
    const token = localStorage.getItem("shift_token");
    if (!API_BASE || !token) return;

    async function checkUnseenPayout() {
      try {
        const res = await fetch(`${API_BASE}/api/my-unseen-payout`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!data) return;

        setPayoutPopup({
          winnerId: data.winnerId,
          amount: data.amount,
          roundId: data.roundId
        });

      } catch (err) {
        console.error("CHECK UNSEEN PAYOUT ERROR:", err);
      }
    }

    checkUnseenPayout();
  }, [API_BASE]);

  // =================================================
  // FLOW INTRO → LOADING → SHIFT
  // =================================================
  if (phase === "intro") {
    return (
      <Fullscreen>
        <Intro onStart={() => setPhase("loading")} />
      </Fullscreen>
    );
  }

  if (phase === "loading") {
    return (
      <Fullscreen>
        <LoadingScreen onLoaded={() => setPhase("shift")} />
      </Fullscreen>
    );
  }

  // =================================================
  // 🔥 SHIFT SCENE
  // =================================================
  return (
    <Fullscreen>
      <ShiftRoom onToast={setToast} />

      {/* 💸 PAYOUT MODAL – apare DOAR dacă există unseen payout */}
      {payoutPopup && (
        <PayoutModal
          payout={payoutPopup}
          onClose={() => setPayoutPopup(null)}
        />
      )}

      {/* 🔔 GLOBAL TOAST (pentru mesaje mici) */}
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
