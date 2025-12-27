import { useEffect, useState } from "react";
import "./leaderboard.css";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [winners, setWinners] = useState([]);
  const [activeTab, setActiveTab] = useState("leaderboard");

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

  async function loadLeaderboard() {
    const res = await fetch(`${API_BASE}/api/leaderboard`);
    const data = await res.json();
    setScores(data);
  }

  async function loadWinners() {
    const res = await fetch(`${API_BASE}/api/last-winners`);
    const data = await res.json();
    setWinners(data);
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
            <span>
              {w.rank === 1 ? "🥇" : w.rank === 2 ? "🥈" : "🥉"}
            </span>
            <span>{w.username}</span>
            <span>${w.amount}</span>
            <span style={{ opacity: 0.6 }}>{formatTime(w.timestamp)}</span>
          </div>
        ))}

      {activeTab === "winners" && winners.length === 0 && (
        <div style={{ textAlign: "center", opacity: 0.6, marginTop: 10 }}>
          No payouts yet.
        </div>
      )}
    </div>
  );
}
