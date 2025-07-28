import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AnalyticsDashboard.css";

// Helper to get week number from a date string (e.g. "2025-07-22" => "2025-W30")
function getWeek(dateString) {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDays = Math.floor((d - firstDayOfYear) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

// Helper to get month label
function getMonth(dateString) {
  return dateString.slice(0, 7); // e.g. "2025-07"
}

function AnalyticsDashboard() {
  const [entries, setEntries] = useState([]);
  const [viewMode, setViewMode] = useState("monthly"); // daily, weekly, monthly
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("journalEntries")) || [];
    setEntries(stored);
  }, []);

  const filtered = selectedMonth
    ? entries.filter((e) => e.date.startsWith(selectedMonth))
    : entries;

  const totalAllTime = entries.reduce((sum, e) => sum + e.amount, 0);
  const totalThisMonth = filtered.reduce((sum, e) => sum + e.amount, 0);

  // Group data based on view mode
  const groupedData = {};
  for (const entry of filtered) {
    let key;
    if (viewMode === "daily") key = entry.date;
    else if (viewMode === "weekly") key = getWeek(entry.date);
    else if (viewMode === "monthly") key = getMonth(entry.date);

    groupedData[key] = (groupedData[key] || 0) + entry.amount;
  }

  const lineData = Object.entries(groupedData).map(([label, amount]) => ({
    label,
    amount,
  }));

  // Pie chart (by category)
  const pieData = Object.entries(
    filtered.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="dashboard">
      <h1>Analytics Dashboard</h1>

      <div className="summary-section">
        <h3>Total Spending (All Time): {totalAllTime.toFixed(2)} Baht</h3>
      </div>

      <div className="month-section">
        <label>Select Month: </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <h3>
          Total for {selectedMonth || "..."}: {totalThisMonth.toFixed(2)} Baht
        </h3>
      </div>

      <div className="month-section">
        <label>View Mode: </label>
        <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="chart-section">
        <h3>Line Chart - {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Spending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Pie Chart - Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d0ed57"].map(
                (color, index) => (
                  <Cell key={index} fill={color} />
                )
              )}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;