import { useEffect, useState } from "react";
import "./leaderboard.css";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE;


  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  async function load() {
    const res = await fetch(`${API_BASE}/api/leaderboard`);
    const data = await res.json();
    setScores(data);
  }
  

  const currentUser = localStorage.getItem("shift_username");

  return (
    <div className="leaderboard-content">
      <h3 className="lb-title">🏆 Leaderboard</h3>

      {scores.map((s, i) => (
        <div
          key={i}
          className={`lb-entry ${s.name === currentUser ? "me" : ""}`}
        >
          <span className="rank">{i + 1}.</span>
          <span className="user">{s.name}</span>
          <span className="score">{s.score}</span>
        </div>
      ))}
    </div>
  );
}
