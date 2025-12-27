import { useEffect, useState, useRef } from "react";

import "./leaderboard.css";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [winners, setWinners] = useState([]);
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [nextPayoutAt, setNextPayoutAt] = useState(null);
  const toastTimeoutRef = useRef(null);

  const [toast, setToast] = useState(null);





  const API_BASE = process.env.REACT_APP_API_BASE;
  const currentUser = localStorage.getItem("shift_username");

  useEffect(() => {
    loadLeaderboard();
    loadWinners();

    const interval = setInterval(() => {
      if (activeTab === "leaderboard") loadLeaderboard();
      if (activeTab === "winners") loadWinners();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);



  useEffect(() => {
    loadPayoutState();
    const sync = setInterval(loadPayoutState, 30000); // resync la 30s
    return () => clearInterval(sync);
  }, []);
  
  

  async function loadLeaderboard() {
    const res = await fetch(`${API_BASE}/api/leaderboard`);
    if (!res.ok) return; // 🔥 oprește eroarea 400 în console
  
    const data = await res.json();
    setScores(data);
  }
  

  async function loadWinners() {
    const res = await fetch(`${API_BASE}/api/last-winners`);
    if (!res.ok) return;
  
    const data = await res.json();
    setWinners(data);
  }
  

  async function loadPayoutState() {
    const res = await fetch(`${API_BASE}/api/payout-state`);
    if (!res.ok) return;
  
    const data = await res.json();
    if (data?.nextRunAt) {
      setNextPayoutAt(new Date(data.nextRunAt).getTime());
    }
  }
  
  

  function formatCountdown() {
    if (!nextPayoutAt) return "--:--";
  
    const diff = nextPayoutAt - Date.now();
    if (diff <= 0) return "00:00";
  
    const min = Math.floor(diff / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
  
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  
  

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function getRankIcon(rank) {
    if (rank === 1) return "/gold.PNG";
    if (rank === 2) return "/silver.PNG";
    return "/bronze.PNG";
  }
  


  return (
    <div className="leaderboard-content">

      {/* TAB HEADER */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <h3
          className="lb-title"
          style={{ cursor: "pointer", opacity: activeTab === "leaderboard" ? 1 : 0.5 }}
          onClick={() => setActiveTab("leaderboard")}
        >
          🏆 Leaderboard
        </h3>

        <h3
          className="lb-title"
          style={{ cursor: "pointer", opacity: activeTab === "winners" ? 1 : 0.5 }}
          onClick={() => setActiveTab("winners")}
        >
          💸 Last Winners
        </h3>
      </div>

      <div style={{
  textAlign: "center",
  fontSize: 13,
  opacity: 0.7,
  marginBottom: 6
}}>
 ⏱ Next payout in {formatCountdown()}

</div>


      {/* LEADERBOARD (codul tău, neschimbat) */}
      {activeTab === "leaderboard" &&
        scores.map((s, i) => (
          <div
            key={i}
            className={`lb-entry ${s.name === currentUser ? "me" : ""}`}
          >
            <span className="rank">{i + 1}.</span>
            <span className="user">{s.name}</span>
            <span className="score">{s.score}</span>
          </div>
        ))}

      {/* LAST WINNERS */}
      {activeTab === "winners" &&
  winners.map((w, i) => (
    <div key={i} className="lb-entry">
<span style={{ width: 18, display: "flex", justifyContent: "center" }}>
  <img
    src={getRankIcon(w.rank)}
    alt={`Rank ${w.rank}`}
    style={{
      width: 16,
      height: 16,
      opacity: 0.9
    }}
  />
</span>

      <span>{w.username}</span>

      <span>${w.amount}</span>

{/* PAID → Solscan */}
{w.paymentStatus === "paid" && w.tx && (
  <a
    href={`https://solscan.io/tx/${w.tx}`}
    target="_blank"
    rel="noopener noreferrer"
    title="View on Solscan"
    style={{ marginLeft: 6 }}
  >
    <img
      src="/solscan.png"
      alt="Solscan"
      style={{
        width: 14,
        height: 14,
        opacity: 0.75,
        cursor: "pointer"
      }}
    />
  </a>
)}

{w.paymentStatus === "failed" && (
  <span
  onClick={() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  
    setToast({
      title: "Reward payment pending",
      message: `The reward of $${w.amount} for ${w.username} could not be sent due to insufficient treasury funds. Please contact @cutare to receive it.`
    });
  
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 5000);
  }}
  
    title="Payment failed"
    style={{
      marginLeft: 6,
      color: "#ff4d4f",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    !
  </span>
)}








      <span style={{ opacity: 0.6 }}>
      {formatTime(w.createdAt)}
      </span>
    </div>
))}


      {activeTab === "winners" && winners.length === 0 && (
        <div style={{ textAlign: "center", opacity: 0.6, marginTop: 10 }}>
          No payouts yet.
        </div>
      )}

{toast && (
  <div
    style={{
      position: "fixed",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#3a1f1f",
      border: "2px solid #ff4d4f",
      padding: "14px 18px",
      borderRadius: 8,
      color: "#ffd6d6",
      zIndex: 9999,
      boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
      minWidth: 280,
      textAlign: "center",
      animation: "fadeIn 0.2s ease-out"
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




    </div>
  );
}
