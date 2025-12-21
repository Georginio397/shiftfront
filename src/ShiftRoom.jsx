import { useState, useEffect, useRef } from "react";
import "./shiftroom.css";
import ParallaxLayer from "./ParallaxLayer";
import ParallaxLayerVideo from "./ParallaxLayerVideo";
import GameModal from "./GameModal";
import Leaderboard from "./Leaderboard";
import AuthModal from "./AuthModal";
import AboutModal from "./AboutModal";

export default function ShiftRoom() {
  const [gameOpen, setGameOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [aboutOpen, setAboutOpen] = useState(false);

  // REFS pentru televizoare
  const aboutVideoRef = useRef(null);
  const playVideoRef = useRef(null);
  const mintVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const aboutHoverRef = useRef(null);
const gameHoverRef = useRef(null);
const mintHoverRef = useRef(null);
const [contractVisible, setContractVisible] = useState(false);
const [copied, setCopied] = useState(false);

useEffect(() => {
  if (gameOpen) {
    document.body.classList.add("game-active");

    // PAUSE toate video-urile din background
    document
      .querySelectorAll("video.parallax-video")
      .forEach(v => v.pause());

  } else {
    document.body.classList.remove("game-active");

    // RESUME video-urile când ieși din joc
    document
      .querySelectorAll("video.parallax-video")
      .forEach(v => {
        v.play().catch(() => {});
      });
  }
}, [gameOpen]);




const CONTRACT_ADDRESS = "Uploading shortly. Patience ";

function copyToClipboard(text) {
  // metoda modernă
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  // FALLBACK — textarea invizibilă
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback copy failed:", err);
  }

  document.body.removeChild(textarea);
  return Promise.resolve();
}


// Final: toggle + copy + feedback
function toggleContract() {
  setContractVisible(prev => !prev);

  copyToClipboard(CONTRACT_ADDRESS)
    .then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    })
    .catch(err => console.error("Copy error:", err));
}




  useEffect(() => {
    const saved = localStorage.getItem("shift_username");
    if (saved) setNickname(saved);
  }, []);

  useEffect(() => {
    if (gameOpen) return; // ❄️ freeze complet
  
    const gif = document.querySelector(".shifter-gif");
    if (!gif) return;
  
    function move(e) {
      const x = (e.clientX - window.innerWidth / 2) * 0.01;
      gif.style.transform = `translateX(-50%) translateY(${x}px)`;
    }
  
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [gameOpen]);
  
  

  function handleGameClick() {
    const token = localStorage.getItem("shift_token");
    if (!token) setAuthOpen(true);
    else setGameOpen(true);
  }

  function playShifterSound() {
    const sounds = [
      "/sounds/1.mp3",
      "/sounds/2.mp3",
      "/sounds/3.mp3",
      "/sounds/4.mp3",
    ];
    function playBackgroundMusic() {
      const audio = new Audio("/sounds/background.mp3");
      audio.loop = true;
      audio.volume = 0.35;
    
      audio.play().catch(err => console.log("Autoplay blocked:", err));
    
      // salvăm într-o variabilă globală pentru acces ulterior
      window.shiftMusic = audio;
    }
    
  
    const random = sounds[Math.floor(Math.random() * sounds.length)];
    const audio = new Audio(random);
    audio.volume = 0.7; // ajustezi cât de tare să fie
    audio.play();
  }
  

  // helpers pentru hover
  function playHover(ref, idleSrc, hoverSrc, isEnter) {
    const v = ref.current;
    if (!v) return;
  
    if (isEnter) {
      v.style.opacity = 0;
      setTimeout(() => {
        v.src = hoverSrc;
        v.currentTime = 0;
        v.style.opacity = 1;
      }, 80);
    } else {
      v.style.opacity = 0;
      setTimeout(() => {
        v.src = idleSrc;
        v.currentTime = 0;
        v.style.opacity = 1;
      }, 80);
    }
  }


  

  return (
    
    
    <div className="scene-wrapper">

<div className="rotate-warning">
<div>
  <div className="rotate-arrow"></div>
  <p>Please rotate your device to landscape mode</p>
</div>

</div>


{/* MUTE BUTTON – RIGHT BOTTOM */}
<div
  className="sound-toggle"
  onClick={() => {
    if (!window.shiftMusic) return;
  
    if (window.shiftMusic.paused) {
      window.shiftMusic.play();
      setIsMuted(false);
    } else {
      window.shiftMusic.pause();
      setIsMuted(true);
    }
  }}
  
>
<img 
  src={isMuted ? "/sound_off.gif" : "/sound_on.gif"}
  className="sound-icon"
/>

</div>

      {/* WORKER BADGE */}
      <div className="name-badge">
        👷 Worker: <span>{nickname || ""}</span>

        {nickname ? (
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("shift_token");
              localStorage.removeItem("shift_username");
              window.location.reload();
            }}
          >
            Logout
          </button>
        ) : (
          <button className="logout-btn" onClick={() => setAuthOpen(true)}>
             Login
          </button>
        )}
      </div>

      {/* TOP MENU – 3 TELEVIZOARE */}
      <div className="security-camera">
  <img src="/Camera.gif" className="cam-frame" alt="camera" />
</div>
      <div className="top-menu">

        {/* SECURITY CAMERA */}



        {/* ABOUT TV */}
        <div
  className="tv-screen"
  onClick={() => setAboutOpen(true)}
  onMouseEnter={() => {
    const v = aboutHoverRef.current;
    if (!v) return;

    v.currentTime = 0;

    v.play().catch(() => {});
  }}
  onMouseLeave={() => {
    const v = aboutHoverRef.current;
    if (!v) return;

    // prevenim conflictul play/pause
    setTimeout(() => {
      v.pause();
    }, 80);
  }}
>
  <video className="tv-video idle" src="/About.webm" autoPlay loop muted />

  <video
    ref={aboutHoverRef}
    className="tv-video hover"
    src="/AboutHover.webm"
    muted
    loop={false}
    playsInline
  />
</div>




        {/* PLAY TV */}
        <div
  className="tv-screen"
  onClick={handleGameClick}
  onMouseEnter={() => {
    const v = gameHoverRef.current;
    if (!v) return;

    v.currentTime = 0;
    v.play().catch(() => {});
  }}
  onMouseLeave={() => {
    const v = gameHoverRef.current;
    if (!v) return;

    setTimeout(() => v.pause(), 80);
  }}
>
  <video className="tv-video idle" src="/game.webm" autoPlay loop muted />

  <video
    ref={gameHoverRef}
    className="tv-video hover"
    src="/play.webm"
    muted
    loop={false}
    playsInline
  />
</div>



        {/* MINT TV */}
        <div
  className="tv-screen"
  onClick={() => console.log("Mint clicked")}
  onMouseEnter={() => {
    const v = mintHoverRef.current;
    if (!v) return;

    v.currentTime = 0;
    v.play().catch(() => {});
  }}
  onMouseLeave={() => {
    const v = mintHoverRef.current;
    if (!v) return;

    setTimeout(() => v.pause(), 80);
  }}
>
  <video className="tv-video idle" src="/mint.webm" autoPlay loop muted />

  <video
    ref={mintHoverRef}
    className="tv-video hover"
    src="/minthover.webm"
    muted
    loop={false}
    playsInline
  />
</div>



      </div>

{/* POSTER RIGHT */}
<a
  href="https://x.com/i/communities/1958972752079008236"
  target="_blank"
  rel="noopener noreferrer"
  className="poster-container"
>
  <div className="poster-inner">
    <img src="/X.png" className="poster-default" alt="X" />
    <img src="/Xhover.png" className="poster-hover" alt="X Hover" />
  </div>
</a>

{/* WALL CLOCK RIGHT SIDE */}
<div className="wall-clock">
  <img src="/clock.gif" alt="Clock" className="clock-img" />
</div>



      {/* PARALLAX SCENE */}
      <div className="scene">
        <ParallaxLayerVideo
          src="/Back.webm"
          intensityX={80}
          intensityY={40}
          invertX={false}
          invertY={false}
        />

        <img src="/Wall.png" className="layer-mid" alt="Wall Layer" />

        <img
  src="/Shifter.gif"
  className="shifter-gif"
  alt="Shifter"
  onClick={playShifterSound}
/>








        <ParallaxLayer
          src="/Front.png"
          speed={0.04}
          invert={false}
          className="front"
        />

        <ParallaxLayer
          src="/Cup.png"
          speed={0.02}
          invert={false}
          className="counter-layer"
        />

        <ParallaxLayer
          src="/Order.png"
          speed={0.04}
          invert={false}
          className="counter-layer"
        />
      </div>

      {/* GAME MODAL */}
      <GameModal open={gameOpen} onClose={() => setGameOpen(false)} />

      {/* AUTH MODAL */}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={() => {
            setNickname(localStorage.getItem("shift_username"));
            setAuthOpen(false);
            setGameOpen(true);
          }}
        />
      )}

      {/* ABOUT MODAL */}
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      {/* LEADERBOARD + FRAME */}
      <div className="lb-frame">
        <img src="/Leaderb.png" className="lb-frame-img" alt="Frame" />
        <div className="lb-content">
          <Leaderboard />
        </div>
      </div>

{/* CONTRACT SLIDE-UP PANEL */}
<div className={`contract-panel ${contractVisible ? "open" : ""}`}>
  <div className="contract-title">Contract Address</div>

  <div className="contract-value">{CONTRACT_ADDRESS}</div>

  {copied && <div className="copied-popup">Copied!</div>}


</div>

{/* FLOATING ARROW TO OPEN PANEL */}
<div 
 className={`contract-arrow ${contractVisible ? "down" : "up"}`}
  onClick={toggleContract}
>
  <img src="/Ca.png" className="arrow-img" alt="arrow" />
</div>



    </div>
  );
}
