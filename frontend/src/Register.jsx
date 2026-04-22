import { useState } from "react";
import axios from "axios";

function Register() {
  const API = import.meta.env.VITE_API_URI;

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

    } catch (err) {
      alert("Registration failed ❌");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-box">

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

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

      <button type="submit">Register</button>

    </form>
  );
}

export default Register;