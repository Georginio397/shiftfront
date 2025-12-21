import "./aboutmodal.css";
import { motion } from "framer-motion";

export default function AboutModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="about-overlay" onClick={onClose}>
      <motion.div
        className="about-box"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="about-title">Who is the Shift Guy?</h2>

        <p className="about-text">
          A worker running on low sleep and pure determination.
          <br />
          He stacks burgers, fights the rush, and somehow keeps going.
        </p>

        <p className="about-text">
          Our game is his daily routine turned into a challenge.
          <br />
          And the <b>555 NFTs?</b> His different moods throughout the shift.
        </p>

        <br />
        <h2 className="about-title">Coming Soon</h2>
        <p className="about-text">
        Exclusive rewards for top leaderboard players.
          <br />
          Keep grinding. Keep winning.
        </p>

        <button className="about-close" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </div>
  );
}
