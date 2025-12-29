import { useState, useEffect } from "react";
import "./stackburger.css";

export default function StackBurgerGame() {
  // bloc inițial
  const [blocks, setBlocks] = useState([
    { width: 200, left: 80, bottom: 0 }
  ]);

  const [currentLeft, setCurrentLeft] = useState(0);
  const [direction, setDirection] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const BLOCK_HEIGHT = 20;
  const MAX_VISIBLE_HEIGHT = 300;
  const AREA_WIDTH = 360;
  const API_BASE = process.env.REACT_APP_API_BASE;

  // GAME FEEL STATES
  const [judgement, setJudgement] = useState(null);
  const [shake, setShake] = useState(false);

  // SCORE SYSTEM
  const [score, setScore] = useState(0);       // float
  const [heat, setHeat] = useState(0);          // 0 → 100
  const [multiplier, setMultiplier] = useState(1);

  /* ================= MULTIPLIER FROM HEAT ================= */
  useEffect(() => {
    if (heat >= 80) setMultiplier(2);
    else if (heat >= 60) setMultiplier(1.5);
    else if (heat >= 30) setMultiplier(1.2);
    else setMultiplier(1);
  }, [heat]);

  /* ================= HEAT DECAY ================= */
  useEffect(() => {
    if (heat <= 0) return;

    const decay = setInterval(() => {
      setHeat(h => Math.max(h - 1, 0));
    }, 120);

    return () => clearInterval(decay);
  }, [heat]);

  /* ================= BLOCK MOVEMENT ================= */
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setCurrentLeft(prev => {
        const currentWidth = blocks[blocks.length - 1].width;
        const maxLeft = AREA_WIDTH - currentWidth;

        let next = prev + direction * 3;

        if (next > maxLeft) {
          next = maxLeft;
          setDirection(-1);
        }
        if (next < 0) {
          next = 0;
          setDirection(1);
        }
        return next;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [direction, gameOver, blocks]);

  /* ================= JUDGEMENT ================= */
  function getJudgement(diff, lastWidth) {
    const ratio = diff / lastWidth;
  
    // marjă minimă în pixeli
    const PERFECT_PX = 6;
    const GOOD_PX = 14;
  
    if (diff <= PERFECT_PX || ratio < 0.12) return "PERFECT";
    if (diff <= GOOD_PX || ratio < 0.45) return "GOOD";
    return "MISS";
  }
  
  

  /* ================= DROP ================= */
  function dropBlock() {
    const last = blocks[blocks.length - 1];
    const diff = Math.abs(currentLeft - last.left);
    const result = getJudgement(diff, last.width);

    setJudgement({ text: result, ts: Date.now() });

    if (result === "MISS") {
      setShake(true);
      setTimeout(() => setShake(false), 180);
    }

    // HEAT UPDATE
    setHeat(prev => {
      if (result === "PERFECT") return Math.min(prev + 25, 100);
      if (result === "GOOD") return Math.min(prev + 8, 100);
      return Math.max(prev - 40, 0);
    });

    // GAME OVER
    if (diff > last.width) {
      setGameOver(true);
      sendScore(Math.floor(score));
      return;
    }

    // SCORE: 1 point * multiplier
    if (result !== "MISS") {
      setScore(prev => prev + multiplier);
    }

    // ADD BLOCK
    const newWidth = last.width - diff;
    const newLeft = Math.max(currentLeft, last.left);

    let newBlocks = [
      ...blocks,
      {
        width: newWidth,
        left: newLeft,
        bottom: last.bottom + BLOCK_HEIGHT
      }
    ];

    if (newBlocks[newBlocks.length - 1].bottom > MAX_VISIBLE_HEIGHT) {
      newBlocks = newBlocks.map(b => ({
        ...b,
        bottom: b.bottom - BLOCK_HEIGHT
      }));
    }

    setBlocks(newBlocks);
  }

  /* ================= BACKEND ================= */
  async function sendScore(finalScore) {
    const token = localStorage.getItem("shift_token");
    if (!token) return;

    await fetch(`${API_BASE}/api/save-score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ score: finalScore })
    });
  }

  /* ================= RESTART ================= */
  function restart() {
    setBlocks([{ width: 200, left: 80, bottom: 0 }]);
    setCurrentLeft(0);
    setDirection(1);
    setGameOver(false);
    setScore(0);
    setHeat(0);
    setMultiplier(1);
    setJudgement(null);
  }

  /* ================= RENDER ================= */
  return (
    <div className="stack-container">
      <h3>🍔 Stack The Burger</h3>

      <div className={`stack-area ${shake ? "shake" : ""}`}>
        <div className="score-bar">
          <span>
            Score: {score.toFixed(1)}
            {multiplier > 1 && (
              <span className="multiplier"> x{multiplier}</span>
            )}
          </span>
        </div>

        {/* HEAT METER */}
<div className="heat-bar">
  <div
    className="heat-fill"
    style={{ width: `${heat}%` }}
  />
</div>


        {blocks.map((b, i) => (
          <img
            key={i}
            src={i === 0 ? "/bun.png" : "/Meat.png"}
            className="burger-block"
            style={{ width: b.width, left: b.left, bottom: b.bottom }}
          />
        ))}

        {!gameOver && (
          <img
            src="/Meat.png"
            className="burger-block moving"
            style={{
              width: blocks[blocks.length - 1].width,
              left: currentLeft,
              bottom: blocks[blocks.length - 1].bottom + BLOCK_HEIGHT + 5
            }}
          />
        )}

{judgement && (
  <div
    key={judgement.ts}
    className={`judgement ${judgement.text.toLowerCase()}`}
  >
    {judgement.text}
  </div>
)}


        {gameOver && <div className="game-over-text">GAME OVER</div>}
      </div>

      {!gameOver ? (
        <button className="stack-btn" onClick={dropBlock}>DROP</button>
      ) : (
        <button className="stack-btn" onClick={restart}>Restart</button>
      )}
    </div>
  );
}
