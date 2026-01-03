import { useState, useEffect, useRef } from "react";
import "./shiftroom.css";
import ParallaxLayer from "./ParallaxLayer";
import ParallaxLayerVideo from "./ParallaxLayerVideo";
import GameModal from "./GameModal";
import Leaderboard from "./Leaderboard";
import AuthModal from "./AuthModal";
import AboutModal from "./AboutModal";
import { setScenePaused } from "./performanceController";
import SecurityCameraModal from "./SecurityCameraModal";



export default function ShiftRoom({ onToast }) {
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
const [wallet, setWallet] = useState("");
const [cameraOpen, setCameraOpen] = useState(false);
const [startingGame, setStartingGame] = useState(false);




const MINT_LINK = "https://launchmynft.io/collections/CWvZc3jpLuD4gUXZ4u13brwyh1GfXNA4VU8YtTbQR7Td/VE9lKalzNceeqyR8TPrT";




const CONTRACT_ADDRESS = "Uploading shortly. Patience ";

useEffect(() => {
  setScenePaused({
    pause: gameOpen || authOpen || aboutOpen,
    unloadBackground: false
  });
  
}, [gameOpen, authOpen, aboutOpen, cameraOpen]);

useEffect(() => {
  const savedUsername = localStorage.getItem("shift_username");
  const savedWallet = localStorage.getItem("shift_wallet");

  if (savedUsername) setNickname(savedUsername);
  if (savedWallet) setWallet(savedWallet);
}, []);

function shortWallet(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}



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
  

  

  async function handleGameClick() {
    const token = localStorage.getItem("shift_token");
  
    // ❌ neautentificat → auth modal
    if (!token) {
      setAuthOpen(true);
      return;
    }
  
    // 🔄 pornim loader
    setStartingGame(true);
  
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/start-game`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (!res.ok) {
        throw new Error("Start game failed");
      }
  
      // ✅ backend a confirmat startul → deschidem jocul
      setGameOpen(true);
  
    } catch (e) {
      console.error("START GAME FAILED:", e);
    } finally {
      // 🔥 oprim loader indiferent de rezultat
      setStartingGame(false);
    }
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
   {/* WORKER BADGE */}
<div className="worker-ui">
  {nickname ? (
    <>
      <div className="name-badge">
        👷 Worker: <span>{nickname}</span>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("shift_token");
            localStorage.removeItem("shift_username");
            localStorage.removeItem("shift_wallet");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      {wallet && (
        <div
          className="wallet-chip"
          title={wallet}
          onClick={() => copyToClipboard(wallet)}
        >
          {shortWallet(wallet)}
        </div>
      )}
    </>
  ) : (
    <div className="name-badge">
       Worker:
      <button className="logout-btn" onClick={() => setAuthOpen(true)}>
        Login
      </button>
    </div>
  )}
</div>



      

      {/* TOP MENU – 3 TELEVIZOARE */}
      <div
  className="security-camera"
  onClick={() => setCameraOpen(true)}
>
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
<video
  className="tv-video idle"
  src="/About.webm"
  autoPlay
  loop
  muted
  playsInline
  data-persistent="true"
/>

<video
  ref={aboutHoverRef}
  className="tv-video hover"
  src="/AboutHover.webm"
  muted
  loop={false}
  playsInline
  data-persistent="true"
/>


</div>




{/* PLAY TV */}
<div
  className="tv-screen"
  onClick={() => {
    if (!startingGame) handleGameClick();
  }}
  onMouseEnter={() => {
    if (startingGame) return;

    const v = gameHoverRef.current;
    if (!v) return;

    v.currentTime = 0;
    v.play().catch(() => {});
  }}
  onMouseLeave={() => {
    if (startingGame) return;

    const v = gameHoverRef.current;
    if (!v) return;

    setTimeout(() => v.pause(), 80);
  }}
  style={{ position: "relative" }}
>
  {/* IDLE VIDEO */}
  <video
    className="tv-video idle"
    src="/game.webm"
    autoPlay
    loop
    muted
    playsInline
    data-persistent="true"
  />

  {/* HOVER VIDEO */}
  <video
    ref={gameHoverRef}
    className="tv-video hover"
    src="/play.webm"
    muted
    loop={false}
    playsInline
    data-persistent="true"
  />

  {/* 🔄 LOADER OVERLAY */}
  {startingGame && (
    <div className="tv-loader">
      <div className="tv-spinner" />
      <div className="tv-loading-text">Starting shift…</div>
    </div>
  )}
</div>




        {/* MINT TV */}
        <div
  className="tv-screen"
  onClick={() => {
    window.open(MINT_LINK, "_blank", "noopener,noreferrer");
  }}
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

<video
  className="tv-video idle"
  src="/mint.webm"
  autoPlay
  loop
  muted
  playsInline
  data-persistent="true"
/>

<video
  ref={mintHoverRef}
  className="tv-video hover"
  src="/minthover.webm"
  muted
  loop={false}
  playsInline
  data-persistent="true"
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
<div
  className="wall-clock clickable"
  onClick={() => {
    const audio = new Audio("/sounds/lockin.mp3"); // 🔊 tu alegi sunetul
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }}
>
  <img src="/Clock.gif" alt="Clock" className="clock-img" />
</div>




      {/* PARALLAX SCENE */}
      <div className="scene">
        <ParallaxLayerVideo
          src="/back.webm"
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

      <SecurityCameraModal
  open={cameraOpen}
  onClose={() => setCameraOpen(false)}
/>


      {/* AUTH MODAL */}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={() => {
            const username = localStorage.getItem("shift_username");
            const wallet = localStorage.getItem("shift_wallet");
          
            setNickname(username);
            setWallet(wallet);
          
            setAuthOpen(false);
          
          }}
          
        />
      )}

      {/* ABOUT MODAL */}
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

  


      {/* LEADERBOARD + FRAME */}
      <div className="lb-frame">
        <img src="/Leaderb.png" className="lb-frame-img" alt="Frame" />
        <div className="lb-content">
        <Leaderboard onToast={onToast} />

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
