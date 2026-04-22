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
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenses(res.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExpense = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post(`${API}/expense`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Expense added ✅");
      fetchExpenses();

    } catch (err) {
      console.log(err);
      alert("Error adding expense");
    }

    setForm({ title: "", amount: "", category: "" });
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Deleted 🗑️");
      fetchExpenses();

    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-box">

        <h2>Expense Dashboard</h2>

        <div className="dashboard-sections">

          <div className="left-section">
            <h3>Add Expense</h3>

            <form onSubmit={addExpense} className="form-box vertical">

              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
              />

              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>

              <button type="submit">Add Expense</button>

            </form>
          </div>

          <div className="right-section">
            <h3>Your Expenses</h3>

            {loading ? (
              <p>Loading...</p>
            ) : expenses.length === 0 ? (
              <p>No expenses yet</p>
            ) : (
              <div className="expense-list">
                {expenses.map((exp) => (
                  <div key={exp._id} className="card">
                    <h4>{exp.title}</h4>
                    <p>₹{exp.amount}</p>
                    <span>{exp.category}</span>

                    <button
                      className="delete-btn"
                      onClick={() => deleteExpense(exp._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;