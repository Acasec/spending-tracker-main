import React, { useEffect, useState } from "react";
import "./JournalPage.css"; // styling (you’ll create next)

function JournalPage() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/spending-category.json")
      .then((res) => res.json())
      .then((data) => {
        const cats = data.map((item) => item.category);
        setCategories(cats);
        if (cats.length > 0) setCategory(cats[0]);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { date, category, amount: parseFloat(amount) };
    const stored = JSON.parse(localStorage.getItem("journalEntries")) || [];
    stored.push(newEntry);
    localStorage.setItem("journalEntries", JSON.stringify(stored));

    setDate("");
    setAmount("");
    setCategory(categories[0]);

    alert("Saved!");
  };

  return (
    <div className="container">
      <h1>Journal Entry</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label>
          Amount (Baht):
          <input
            type="number"
            value={amount}
            step="0.01"
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        <button type="submit">Save Record</button>
      </form>
    </div>
  );
}

export default JournalPage;