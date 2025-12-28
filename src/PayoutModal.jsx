import "./payoutmodal.css";

export default function PayoutModal({ amount, onClose }) {
  return (
    <div className="payout-overlay">
      <div className="payout-box">
        <h1>💸 YOU GOT PAID!</h1>
        <p className="amount">${amount}</p>

        <button onClick={onClose}>
          LET’S GO 🔥
        </button>
      </div>
    </div>
  );
}
