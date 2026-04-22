import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("https://practice1a.onrender.com/expenses", {
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

  // ✅ ADD EXPENSE WITH VALIDATION
  const addExpense = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category) {
      alert("All fields are required");
      return;
    }

    const newExpense = { ...form, _id: Date.now() };
    setExpenses([newExpense, ...expenses]);

    try {
      await axios.post("https://practice1a.onrender.com/expense", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }

    setForm({ title: "", amount: "", category: "" });
  };

  // 🗑️ DELETE EXPENSE
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`https://practice1a.onrender.com/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-box">

        <h2>Expense Dashboard</h2>

        <div className="dashboard-sections">

          {/* LEFT: ADD FORM */}
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
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
              />
              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              />
              <button>Add Expense</button>
            </form>
          </div>

          {/* RIGHT: VIEW + DELETE */}
          <div className="right-section">
            <h3>Your Expenses</h3>

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
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;