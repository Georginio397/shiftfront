import { motion } from "framer-motion";
import "./intro.css";

export default function Intro({ onStart }) {

  function startBackgroundMusic() {
    // dacă muzica deja există → doar o repornim
    if (window.shiftMusic) {
      window.shiftMusic.play().catch(() => {});
      return;
    }

    const audio = new Audio("/sounds/background.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    audio.play().catch(err => {
      console.warn("Autoplay blocked:", err);
    });

    window.shiftMusic = audio;
  }

  function startShift() {
    startBackgroundMusic(); 
    onStart(); // merge la Loading Screen
  }

  return (
    <div className="intro-container">

      <motion.img
        src="/Intro.gif"
        className="intro-logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      />

      <motion.h1
        className="intro-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Welcome back, again.
      </motion.h1>

      <motion.button
        className="intro-btn"
        onClick={startShift}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
      >
        Start Your Shift
      </motion.button>
    </div>
  );
}
