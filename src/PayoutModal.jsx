import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./payoutmodal.css";

export default function PayoutModal({ payout, onClose }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // 🧹 Oprește confetti după 4 secunde
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  async function closePopup() {
    const API_BASE = process.env.REACT_APP_API_BASE;
    const token = localStorage.getItem("shift_token");

    if (token && payout?.winnerId) {
      try {
        await fetch(`${API_BASE}/api/mark-payout-seen`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            winnerId: payout.winnerId
          })
        });
      } catch (err) {
        console.error("MARK PAYOUT SEEN ERROR:", err);
      }
    }

    onClose();
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={250}
          gravity={0.25}
          wind={0.01}
        />
      )}

      <div className="payout-overlay">
        <div className="payout-box">
          <h1>💸 You got paid!</h1>
          <p className="payout-amount">${payout.amount}</p>

          <button className="payout-btn" onClick={closePopup}>
            Got it
          </button>
        </div>
      </div>
    </>
  );
}
