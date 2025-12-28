import "./payoutmodal.css";

export default function PayoutModal({ payout, onClose }) {
  async function closePopup() {
    const API_BASE = process.env.REACT_APP_API_BASE;
    const token = localStorage.getItem("shift_token");

    if (!token || !payout?.winnerId) {
      onClose();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/mark-payout-seen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          winnerId: payout.winnerId
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("MARK PAYOUT FAILED:", err);
        return; // ❌ NU închidem popup-ul dacă nu s-a marcat
      }

      // ✅ DOAR aici e sigur
      onClose();

    } catch (err) {
      console.error("MARK PAYOUT SEEN ERROR:", err);
    }
  }

  return (
    <div className="payout-overlay">
      <div className="payout-box">
        <h1>💸 You got paid!</h1>
        <p className="payout-amount">${payout.amount}</p>

        <button className="payout-btn" onClick={closePopup}>
          Got it
        </button>
      </div>
    </div>
  );
}
