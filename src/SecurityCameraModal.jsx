import { useEffect } from "react";
import { motion } from "framer-motion";
import "./securityCameraModal.css";

export default function SecurityCameraModal({ open, onClose }) {
  if (!open) return null;

  // ESC to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="camera-overlay" onClick={onClose}>
      <motion.div
        className="camera-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <video
          src="/rizz.webm"   // 👈 aici pui ce vrei tu
          autoPlay
          controls
          playsInline
          className="camera-video"
        />
      </motion.div>
    </div>
  );
}
