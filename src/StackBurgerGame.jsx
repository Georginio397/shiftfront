import { useState, useEffect } from "react";
import "./stackburger.css";

export default function StackBurgerGame() {
  // blocul inițial centrat perfect: (360 - 200) / 2 = 80
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
  const [judgement, setJudgement] = useState(null);
// { text: "PERFECT" | "GOOD" | "MISS", ts: number }

const [shake, setShake] = useState(false);



  // mișcare stânga-dreapta
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

  function getJudgement(diff, lastWidth) {
    const ratio = diff / lastWidth;
  
    if (ratio < 0.05) return "PERFECT"; // foarte precis
    if (ratio < 0.25) return "GOOD";
    return "MISS";
  }
  


  function dropBlock() {
    const last = blocks[blocks.length - 1];
    const diff = Math.abs(currentLeft - last.left);
  
    const result = getJudgement(diff, last.width);
  
    setJudgement({ text: result, ts: Date.now() });
  
    if (result === "MISS") {
      setShake(true);
      setTimeout(() => setShake(false), 180);
    }
  
    // GAME OVER logic rămâne
    if (diff > last.width) {
      setGameOver(true);
      sendScore(blocks.length - 1);
      return;
    }
  
    const newWidth = last.width - diff;
    const newLeft = Math.max(currentLeft, last.left);
  
    const newBlock = {
      width: newWidth,
      left: newLeft,
      bottom: last.bottom + BLOCK_HEIGHT
    };
  
    let newBlocks = [...blocks, newBlock];
  
    if (newBlock.bottom > MAX_VISIBLE_HEIGHT) {
      newBlocks = newBlocks.map(b => ({
        ...b,
        bottom: b.bottom - BLOCK_HEIGHT
      }));
    }
  
    setBlocks(newBlocks);
  }
  


  async function sendScore(score) {
    const token = localStorage.getItem("shift_token");
    if (!token) return;
  
    await fetch(`${API_BASE}/api/save-score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ score })
    });
  }
  


  function restart() {
    setBlocks([{ width: 200, left: 80, bottom: 0 }]);
    setCurrentLeft(0);
    setGameOver(false);
  }


  return (
    <div className="stack-container">
      <h3>🍔 Stack The Burger</h3>

      <div className={`stack-area ${shake ? "shake" : ""}`}>


        {/* SCORE BAR */}
        <div className="score-bar">
          <span>Score: {blocks.length - 1}</span>
        </div>

        {/* BLOCURI STIVUITE */}
        {blocks.map((b, i) => (
          <img
            key={i}
            src={i === 0 ? "/bun.png" : "/Meat.png"}
            className="burger-block"
            style={{
              width: b.width,
              left: b.left,
              bottom: b.bottom
            }}
          />
        ))}

        {/* BLOC ÎN MIȘCARE */}
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
  <div key={judgement.ts} className={`judgement ${judgement.text.toLowerCase()}`}>
    {judgement.text}
  </div>
)}


        {/* GAME OVER ÎN INTERIOR */}
        {gameOver && (
          <div className="game-over-text">GAME OVER</div>
        )}

      </div>

      {/* BUTOANE */}
      {!gameOver ? (
        <button className="stack-btn" onClick={dropBlock}>
          DROP
        </button>
      ) : (
        <button className="stack-btn" onClick={restart}>
          Restart
        </button>
      )}
    </div>
  );
}
