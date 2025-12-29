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
          Our game turns his daily routine into a challenge.
          <br />
          And the <b>555 NFTs</b> represent his different moods throughout the shift.
        </p>

        <br />

        <h2 className="about-title">Get Paid for Your Work</h2>

        <p className="about-text">
          Every <b>5 minutes</b>, a shift cycle ends.
          <br />
          The <b>top players on the leaderboard</b> are rewarded automatically,
          based purely on performance.
        </p>

        <p className="about-text">
          <b>Current payouts per cycle:</b>
        </p>

        <div className="payout-list">
          <div className="payout-row">
            <img src="/gold.PNG" alt="Top 1" />
            <span><b>Top 1</b> — $10</span>
          </div>

          <div className="payout-row">
            <img src="/silver.PNG" alt="Top 2" />
            <span><b>Top 2</b> — $5</span>
          </div>

          <div className="payout-row">
            <img src="/bronze.PNG" alt="Top 3" />
            <span><b>Top 3</b> — $5</span>
          </div>
        </div>

        {/* 🔥 STATS */}
        <div className="payout-stats">
          <div className="stat-box">
            <div className="stat-value">$240+</div>
            <div className="stat-label">paid per hour</div>
          </div>

          <div className="stat-box">
            <div className="stat-value">$5,760+</div>
            <div className="stat-label">paid every 24 hours</div>
          </div>
        </div>

        <p className="about-text subtle">
          Rewards are distributed automatically every 5 minutes,
          based purely on leaderboard performance.
        </p>

        <p className="about-text">
          No randomness. No luck.
          <br />
          Just consistency, focus, and skill.
        </p>

        <p className="about-text">
          This system is built as a real opportunity for newcomers —
          <br />
          a way to create an initial budget and discipline
          before stepping into trading.
        </p>

        <p className="about-text">
          You don’t need experience.
          <br />
          You don’t need a big bankroll.
          <br />
          You just need to show up and keep grinding.
        </p>

        <button className="about-close" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </div>
  );
}
