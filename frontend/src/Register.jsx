import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const API = import.meta.env.VITE_API_URI;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("All fields required");
      return;
    }

    try {
      await axios.post(`${API}/register`, form);

      alert("Registered successfully ✅");

      // redirect to login
      navigate("/login");

    } catch (err) {
      console.log(err);
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="home-wrapper">
      <div className="home-box">

        <h2>Create Account</h2>

        <div className="toggle-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button className="active">Register</button>
        </div>

        <form onSubmit={handleSubmit} className="form-box">

          <input
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit">Register</button>

        </form>

      </div>
    </div>
  );
}

export default Register;