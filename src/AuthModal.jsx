import { useState } from "react";
import "./authmodal.css";

export default function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE;

  if (!API_BASE) {
    console.error("API base URL missing. Check Vercel ENV.");
  }

  async function submitForm(e) {
    e.preventDefault();

    const endpoint = isLogin
      ? "/api/auth/login"
      : "/api/auth/signup";

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Auth error");
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
        <div className="close-btn" onClick={onClose}>✖ Close</div>

        <div className="auth-title">
          {isLogin ? "Login" : "Sign Up"}
        </div>

        <form onSubmit={submitForm}>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onMouseEnter={() => setShowPassword(true)}
            onMouseLeave={() => setShowPassword(false)}
          />

          <button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </div>
      </div>
    </div>
  );
}
