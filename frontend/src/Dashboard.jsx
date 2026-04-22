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

  // FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const res = await axios.get("https://practice1a.onrender.com/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenses(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
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

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD EXPENSE
  const addExpense = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category) {
      alert("All fields are required");
      return;
    }

    // DUPLICATE CHECK
    const duplicate = expenses.find(
      (exp) =>
        exp.title === form.title &&
        exp.amount === Number(form.amount) &&
        exp.category === form.category
    );

    if (duplicate) {
      alert("Duplicate expense detected!");
      return;
    }

    try {
      await axios.post("https://practice1a.onrender.com/expense", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Expense added successfully ✅");

      fetchExpenses(); // refresh list

    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.msg || err.message));
    }

    setForm({ title: "", amount: "", category: "" });
  };

  // DELETE EXPENSE
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`https://practice1a.onrender.com/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Expense deleted 🗑️");

      fetchExpenses();

    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
      alert("Delete failed ❌");
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
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
              />

              {/* ✅ DROPDOWN FIX */}
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