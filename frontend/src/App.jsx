import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import WeeklyLogs from "./pages/WeeklyLogs";
import Evaluations from "./pages/Evaluations";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  const [account, setAccount] = useState(() => {
    const savedAccount = localStorage.getItem("iles-account");
    return savedAccount ? JSON.parse(savedAccount) : null;
  });

  function handleLogin(nextAccount) {
    localStorage.setItem("iles-account", JSON.stringify(nextAccount));
    setAccount(nextAccount);
  }

  function handleLogout() {
    localStorage.removeItem("iles-account");
    setAccount(null);
  }

  if (!account) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    // BrowserRouter enables page navigation without reloading the whole React app.
    <BrowserRouter>
      <Navbar account={account} onLogout={handleLogout} />

      <div className="main-layout">
        <Sidebar account={account} />
        <main className="content">
          {/* Each Route connects a URL path to the page component shown in the main content area. */}
          <Routes>
            <Route path="/" element={<Home account={account} />} />
            <Route
              path="/weeklyLogs"
              element={
                account.role === "company" ? <WeeklyLogs account={account} /> : <Navigate to="/Reports" />
              }
            />
            <Route
              path="/Evaluations"
              element={
                account.role === "lecturer" ? <Evaluations account={account} /> : <Navigate to="/weeklyLogs" />
              }
            />
            <Route
              path="/Reports"
              element={
                account.role === "lecturer" ? <Reports account={account} /> : <Navigate to="/weeklyLogs" />
              }
            />
            <Route path="/Settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
