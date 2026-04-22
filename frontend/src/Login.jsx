import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const API = import.meta.env.VITE_API_URI;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("All fields required");
      return;
    }

    try {
      const res = await axios.post(`${API}/login`, form);

      localStorage.setItem("token", res.data.token);

      alert("Login successful ✅");
      navigate("/dashboard");

    } catch (err) {
      alert("Invalid credentials ❌");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-box">

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button type="submit">Login</button>

    </form>
  );
}

export default Login;