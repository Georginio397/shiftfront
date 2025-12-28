import { useState, useEffect, useRef } from "react";
import Intro from "./Intro";
import LoadingScreen from "./LoadingScreen";
import ShiftRoom from "./ShiftRoom";
import PayoutModal from "./PayoutModal";

const Fullscreen = ({ children }) => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      overflow: "hidden"
    }}
  >
    {children}
  </div>
);

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [toast, setToast] = useState(null);

  // 🔥 PAYOUT STATE (GLOBAL)
  const [payoutPopup, setPayoutPopup] = useState(null);
  const lastPayoutIdRef = useRef(null);

  // =================================================
  // GLOBAL PAYOUT POLLING (NU DISPARĂ NICIODATĂ)
  // =================================================
  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_BASE;
    const token = localStorage.getItem("shift_token");
    const currentUserId = localStorage.getItem("shift_user_id");

    if (!API_BASE || !token || !currentUserId) return;

    async function checkPayout() {
      try {
        const res = await fetch(`${API_BASE}/api/last-winners`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) return;

        const latest = data[0];

        // ❌ deja procesat
        if (lastPayoutIdRef.current === latest._id) return;
        lastPayoutIdRef.current = latest._id;

        // ✅ payout pentru userul curent → MODAL MARE
        if (String(latest.userId) === String(currentUserId)) {
          setPayoutPopup({
            amount: latest.amount,
            roundId: latest.roundId
          });
        } else {
          // payout pentru altcineva → TOAST MIC
          setToast({
            title: "Payout",
            message: `${latest.username} got paid $${latest.amount}`
          });

          // auto-dismiss toast
          setTimeout(() => setToast(null), 4000);
        }

      } catch (err) {
        console.error("PAYOUT POLL ERROR:", err);
      }
    }

    checkPayout();
    const interval = setInterval(checkPayout, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("shift_token");
    if (!token) return;
  
    async function checkUnseenPayout() {
      const res = await fetch(`${API_BASE}/api/my-unseen-payout`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!res.ok) return;
  
      const data = await res.json();
      if (!data) return;
  
      setPayoutPopup({
        winnerId: latest._id,
        amount: latest.amount,
        roundId: latest.roundId
      });
      
    }
  
    checkUnseenPayout();
  }, []);
  

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

      {/* ✅ PAYOUT MODAL (CENTRAT, MARE) */}
      {payoutPopup && (
        <PayoutModal
          amount={payoutPopup.amount}
          onClose={() => setPayoutPopup(null)}
        />
      )}

      {/* GLOBAL TOAST (rămâne exact ca înainte) */}
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
