import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: ""
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔄 FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const res = await axios.get("https://practice1a.onrender.com/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✍️ HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ ADD EXPENSE (OPTIMIZED)
  const addExpense = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category) {
      alert("All fields are required");
      return;
    }

    // 🧠 TEMP EXPENSE (for instant UI)
    const tempExpense = {
      ...form,
      _id: "temp-" + Date.now()
    };

    setExpenses((prev) => [tempExpense, ...prev]);

    try {
      await axios.post("https://practice1a.onrender.com/expense", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 🔄 Sync with backend (removes temp + prevents duplicates)
      fetchExpenses();

    } catch (err) {
      console.log(err);
      // ❌ rollback if error
      setExpenses((prev) => prev.filter((exp) => exp._id !== tempExpense._id));
    }

    setForm({ title: "", amount: "", category: "" });
  };

  // 🗑️ DELETE EXPENSE
  const deleteExpense = async (id) => {
    const oldExpenses = expenses;

    // ⚡ instant remove
    setExpenses((prev) => prev.filter((exp) => exp._id !== id));

    try {
      await axios.delete(`https://practice1a.onrender.com/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log(err);
      // rollback if failed
      setExpenses(oldExpenses);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-box">

        <h2>Expense Dashboard</h2>

        <div className="dashboard-sections">

          {/* LEFT: ADD */}
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

              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              />

              <button type="submit">Add Expense</button>
            </form>
          </div>

          {/* RIGHT: VIEW */}
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
                      disabled={exp._id.startsWith("temp")}
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