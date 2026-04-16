import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      window.location.href = "/";

    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page-container">
      <div style={{ padding: "20px" }}>
        <h2>Login</h2>

        <input
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary" onClick={handleLogin}>
          Login
        </button>

        <p style={{ marginTop: "10px" }}>
          Don't have account?{" "}
          <span
            style={{ color: "#3b82f6", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}