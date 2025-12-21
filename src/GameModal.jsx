import StackBurgerGame from "./StackBurgerGame";
import "./gamemodal.css";

export default function GameModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevenim închiderea la click în interior
      >
        <button className="close-btn" onClick={onClose}>✖</button>
        <StackBurgerGame />

      </div>
    </div>
  );
}
