import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const API = import.meta.env.VITE_API_URI;

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: ""
  });

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/expense`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Added ✅");
      fetchExpenses();

    } catch (err) {
      alert("Error ❌");
    }

    setForm({ title: "", amount: "", category: "" });
  };

  const deleteExpense = async (id) => {
    await axios.delete(`${API}/expense/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchExpenses();
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-box">

        <h2>Dashboard</h2>

        <div className="dashboard-sections">

          <form onSubmit={addExpense} className="form-box">

            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
            <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} />

            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>

            <button>Add</button>

          </form>

          <div className="expense-list">
            {expenses.map((e) => (
              <div key={e._id} className="card">
                <h4>{e.title}</h4>
                <p>₹{e.amount}</p>
                <span>{e.category}</span>
                <button onClick={() => deleteExpense(e._id)}>Delete</button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;