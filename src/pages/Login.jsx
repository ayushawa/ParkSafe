import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import parkingImg from "../assets/parking.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful 🎉");

      setTimeout(() => {
        window.location.href = "/";
      }, 800);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* ✅ IMAGE LEFT */}
        <div className="login-image">
          <img src={parkingImg} alt="parking" />
        </div>

        {/* ✅ LOGIN RIGHT */}
        <div className="login-form">

          <h2 className="login-title">User Login</h2>

          <input
            className="login-input"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="login-actions">
            <button className="login-btn" onClick={handleLogin}>
              LOGIN
            </button>

            <span className="reset-text">Reset</span>
          </div>

          <p className="signup-text">
            Don’t have account?{" "}
            <span onClick={() => navigate("/signup")}>Signup</span>
          </p>

        </div>

      </div>

    </div>
  );
}