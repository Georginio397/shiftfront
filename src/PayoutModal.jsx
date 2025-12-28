// PayoutModal.jsx
import "./payoutmodal.css";

export default function PayoutModal({ winnerId, amount, onClose }) {

  async function closePopup() {
    const API_BASE = process.env.REACT_APP_API_BASE;
    const token = localStorage.getItem("shift_token");

    try {
      await fetch(`${API_BASE}/api/mark-payout-seen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ winnerId })
      });
    } catch (e) {
      console.error("MARK SEEN FAILED", e);
    }

    onClose(); // 👈 închide popup-ul vizual
  }

  return (
    <div className="payout-overlay">
      <div className="payout-box">
        <h1>💸 You got paid!</h1>
        <p>${amount}</p>

        <button onClick={closePopup}>
          Close
        </button>
      </div>
    </div>
  );
}
