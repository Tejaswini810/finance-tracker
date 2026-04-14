import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );

  const [type, setType] = useState("Income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!amount || !category || !date) {
      alert("Please fill all fields");
      return;
    }

    const parsedAmount = parseFloat(amount);

    if (parsedAmount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const incomeTotal = transactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenseTotal = transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = incomeTotal - expenseTotal;

    if (type === "Expense" && parsedAmount > balance) {
      alert("❌ Cannot add expense! Insufficient balance.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type: type,
      amount: parsedAmount,
      category: category,
      date: date
    };

    setTransactions([...transactions, newTransaction]);

    setAmount("");
    setCategory("");
    setDate("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filteredTransactions = transactions.filter((t) => {
    return (
      (filterType === "All" || t.type === filterType) &&
      t.category.toLowerCase().includes(filterCategory.toLowerCase()) &&
      (!startDate || t.date >= startDate) &&
      (!endDate || t.date <= endDate)
    );
  });

  const income = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  const expenseData = transactions.filter((t) => t.type === "Expense");

  const categoryTotals = expenseData.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map((key) => ({
    name: key,
    value: categoryTotals[key]
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1>💰 TEST VERSION 123</h1>
      <div className="summary">
        <div className="card income">💵 Income: ${income}</div>
        <div className="card expense">💸 Expenses: ${expense}</div>
        <div className="card balance">🏦 Balance: ${balance}</div>
      </div>

      <div className="box">
        <h2>Filters</h2>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <input
          placeholder="Filter by Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />

        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="box">
        <h2>Add Transaction</h2>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <button onClick={addTransaction}>Add</button>
      </div>

      <div className="charts">
        <div className="chart-box">
          <h2>📊 Pie Chart Breakdown</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value" outerRadius={100} label>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>📈 Bar Chart</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="box">
        <h2>Transactions</h2>

        {filteredTransactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          filteredTransactions.map((t) => (
            <div key={t.id} className="transaction">
              <span>{t.type}</span>
              <span>${t.amount}</span>
              <span>📁 {t.category}</span>
              <span>{t.date}</span>

              <button onClick={() => deleteTransaction(t.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;