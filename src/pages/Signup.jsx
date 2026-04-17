import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import parkingImg from "../assets/parking.png"; // ✅ SAME IMAGE

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Signup successful 🎉");
        navigate("/login");
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* 🔥 LEFT - IMAGE */}
        <div className="login-image">
          <img src={parkingImg} alt="parking" />
        </div>

        {/* 🔥 RIGHT - FORM */}
        <div className="login-form">

          <h2 className="login-title">Create Account</h2>

          <input
            className="login-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            <button className="login-btn" onClick={handleSignup}>
              SIGNUP
            </button>

            <span className="reset-text">Reset</span>
          </div>

          <p className="signup-text">
            Already have account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;