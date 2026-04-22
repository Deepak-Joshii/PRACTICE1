import { useState } from "react";
import axios from "axios";

function Home() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "register") {
        await axios.post("https://practice1a.onrender.com/register", form);
        alert("Registered Successfully");
        setMode("login");
      } else {
        const res = await axios.post("https://practice1a.onrender.com/login", form);
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="home-container">
      <div className="box">
        <h1>Expense Manager</h1>

        <div className="toggle">
          <button onClick={() => setMode("login")} className={mode === "login" ? "active" : ""}>
            Login
          </button>
          <button onClick={() => setMode("register")} className={mode === "register" ? "active" : ""}>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input name="name" placeholder="Name" onChange={handleChange} />
          )}
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button>{mode === "login" ? "Login" : "Register"}</button>
        </form>
      </div>
    </div>
  );
}

export default Home;