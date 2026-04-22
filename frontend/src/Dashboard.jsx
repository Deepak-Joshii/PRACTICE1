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

  // FETCH
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

  // INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD EXPENSE (🔥 FIXED)
  const addExpense = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category) {
      alert("Fill all fields");
      return;
    }

    // 🔥 TEMP EXPENSE (instant UI)
    const tempExpense = {
      _id: Date.now().toString(),
      ...form
    };

    setExpenses((prev) => [tempExpense, ...prev]);

    try {
      await axios.post(`${API}/expense`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 🔄 sync real data
      fetchExpenses();

    } catch (err) {
      alert("Error adding");
      console.log(err);

      // rollback if failed
      setExpenses((prev) =>
        prev.filter((exp) => exp._id !== tempExpense._id)
      );
    }

    setForm({ title: "", amount: "", category: "" });
  };

  // DELETE
  const deleteExpense = async (id) => {
    const old = expenses;

    setExpenses((prev) => prev.filter((e) => e._id !== id));

    try {
      await axios.delete(`${API}/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      alert("Delete failed");
      setExpenses(old);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-box">

        <h2>Dashboard</h2>

        <div className="dashboard-sections">

          {/* ADD FORM */}
          <form onSubmit={addExpense} className="form-box">

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

            <button>Add</button>

          </form>

          {/* LIST */}
          <div className="expense-list">
            {expenses.length === 0 ? (
              <p>No expenses yet</p>
            ) : (
              expenses.map((e) => (
                <div key={e._id} className="card">
                  <h4>{e.title}</h4>
                  <p>₹{e.amount}</p>
                  <span>{e.category}</span>
                  <button onClick={() => deleteExpense(e._id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;