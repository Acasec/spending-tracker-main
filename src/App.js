import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import JournalPage from "./pages/JournalPage";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Analytics</Link> | <Link to="/journal">Journal</Link>
      </nav>
      <Routes>
        <Route path="/" element={<AnalyticsDashboard />} />
        <Route path="/journal" element={<JournalPage />} />
      </Routes>
    </Router>
  );
}

export default App;