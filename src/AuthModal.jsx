import { useState } from "react";
import "./authmodal.css";

export default function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE;

  function isValidSolanaAddress(address) {
    // Base58 regex (fără 0 O I l)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  
    if (!address) return false;
    if (address.length < 32 || address.length > 44) return false;
    if (!base58Regex.test(address)) return false;
  
    return true;
  }
  

  function generatePass() {
    const pass = Math.random().toString(36).slice(2, 10);
    setPassword(pass);
  }

  async function submitForm(e) {
    e.preventDefault();

    if (!API_BASE) {
      alert("API base URL missing. Check Vercel ENV.");
      return;
    }

    if (!username || !password) {
      alert("Username and password required.");
      return;
    }

    if (!isLogin) {
      if (!wallet) {
        alert("Wallet address required for rewards.");
        return;
      }
    
      if (!isValidSolanaAddress(wallet)) {
        alert("Invalid Solana wallet address.");
        return;
      }
    }
    
    

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, wallet })
      });

      let data = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("Server returned invalid response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Authentication failed");
      }

      localStorage.setItem("shift_token", data.token);
      localStorage.setItem("shift_username", data.user.username);
      localStorage.setItem("shift_user_id", data.user.id);
      localStorage.setItem("shift_wallet", data.user.wallet);

      

      onSuccess();
      onClose();

    } catch (err) {
      console.error("AUTH ERROR:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-box">

        <div className="close-btn" onClick={onClose}>
          ✖ Close
        </div>

        <div className="auth-title">
          {isLogin ? "Login" : "Sign Up"}
        </div>

        <form onSubmit={submitForm} className="auth-form">

          {/* USERNAME */}
          <input
            className="auth-input"
            placeholder="Username"
            maxLength={16}
            value={username}
            onChange={(e) => {
              let val = e.target.value;
              val = val.replace(/[^a-zA-Z0-9_]/g, "");
              setUsername(val);
            }}
          />

          {username.length >= 16 && (
            <div className="limit-warning">
              Maximum 16 characters allowed.
            </div>
          )}

{!isLogin && (
  <input
  className="auth-input"
  placeholder="Solana wallet address"
  value={wallet}
  onChange={(e) => {
    const val = e.target.value.trim();
    setWallet(val);
  }}
/>

)}


          {/* PASSWORD */}
          <div
            className="password-wrapper"
            onMouseEnter={() => setShowPassword(true)}
            onMouseLeave={() => setShowPassword(false)}
          >
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span className="show-pass-hint">
              👁 Hover to reveal
            </span>
          </div>

          {!isLogin && (
            <button
              type="button"
              className="pass-gen-btn"
              onClick={generatePass}
            >
              Generate Random Password
            </button>
          )}

          <button
            className="auth-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Sign Up"}
          </button>

        </form>

        <div
          className="auth-switch"
          onClick={() => {
            setIsLogin(!isLogin);
            setPassword("");
          }}
        >
          {isLogin
            ? "Need an account? Sign up"
            : "Already have an account? Login"}
        </div>

      </div>
    </div>
  );
}
