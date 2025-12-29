import "./aboutmodal.css";
import { motion } from "framer-motion";

export default function AboutModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="about-overlay" onClick={onClose}>
      <motion.div
        className="about-box wide"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="about-grid">

          {/* ================= LEFT COLUMN ================= */}
          <div className="about-col left">
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

            <p className="about-text emphasis">
              No randomness. No luck.
              <br />
              Just consistency, focus, and skill.
            </p>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="about-col right">
            <h2 className="about-title">Get Paid for Your Work</h2>

            <p className="about-text">
              Every <b>5 minutes</b>, a shift cycle ends.
              <br />
              The <b>top players</b> are rewarded automatically.
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

            <div className="payout-stats">
              <div className="stat-box">
                <div className="stat-value">$240+</div>
                <div className="stat-label">paid per hour</div>
              </div>

              <div className="stat-box">
                <div className="stat-value">$5,000+</div>
                <div className="stat-label">paid every 24h</div>
              </div>
            </div>

            <p className="about-text subtle">
            Every payout is executed <b>on-chain</b>.
  <br />
  Full transaction proof available on{" "}
  <a
    href="https://solscan.io/account/7YYM2FYn6q8d9GMMZNte3Vxfd6gCXMUYND29BtQh3Coc#transfers"
    target="_blank"
    rel="noopener noreferrer"
    className="solscan-link"
  >
    Solscan
  </a>.
            </p>
          </div>

        </div>

        <button className="about-close" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </div>
  );
}
