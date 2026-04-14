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
  CartesianGrid
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

    const currentIncome = transactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpense = transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = currentIncome - currentExpense;

    if (type === "Expense" && parsedAmount > currentBalance) {
      alert("❌ Cannot add expense! Insufficient balance.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type,
      amount: parsedAmount,
      category,
      date
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
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  const expenseData = transactions.filter((t) => t.type === "Expense");

  const categoryTotals = expenseData.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
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

      <h1>💰 ANT Premium Finance Tracker</h1>

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
          <option>Income</option>
          <option>Expense</option>
        </select>

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
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

          <PieChart width={300} height={300}>
            <Pie
              data={chartData}
              cx={150}
              cy={150}
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </div>

        <div className="chart-box">
          <h2>📈 Bar Chart</h2>

          <BarChart width={400} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
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