import { useState } from "react";
import "./authmodal.css";

export default function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const API_BASE = "http://192.168.100.14:5000";


  function generatePass() {
    const pass = Math.random().toString(36).slice(2, 10);
    setPassword(pass);
  }

  async function submitForm(e) {
    e.preventDefault();
  
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
  
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      alert(data.error);
      return;
    }
  
    localStorage.setItem("shift_username", username);
    localStorage.setItem("shift_token", data.token);
  
    onSuccess();
    onClose();
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

          {/* USERNAME INPUT CU LIMITĂ */}
          <input
            className="auth-input"
            placeholder="Username"
            maxLength={16} // limită hard
            value={username}
            onChange={(e) => {
              let val = e.target.value;

              // Acceptă doar litere, cifre și _
              val = val.replace(/[^a-zA-Z0-9_]/g, "");

              setUsername(val);
            }}
          />

          {/* Warning la limită */}
          {username.length >= 16 && (
            <div className="limit-warning">
              Maximum 16 characters allowed.
            </div>
          )}

          {/* PASSWORD INPUT */}
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

            <span className="show-pass-hint">👁 Hover to reveal</span>
          </div>

          {/* GENERATE PASSWORD BTN doar la signup */}
          {!isLogin && (
            <button
              type="button"
              className="pass-gen-btn"
              onClick={generatePass}
            >
              Generate Random Password
            </button>
          )}

          <button className="auth-btn" type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>

        </form>

        <div
          className="auth-switch"
          onClick={() => {
            setIsLogin(!isLogin);
            setPassword("");
          }}
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </div>

      </div>
    </div>
  );
}
