import { useEffect } from "react";
import "./arcadeAlert.css";

export default function ArcadeAlert({ message, type = "error", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`arcade-alert ${type}`}>
      <span className="alert-icon">
        {type === "error" ? "⚠️" : "✅"}
      </span>
      <span className="alert-text">{message}</span>
      <button className="alert-close" onClick={onClose}>✖</button>
    </div>
  );
}
