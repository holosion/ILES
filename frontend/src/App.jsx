import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import WeeklyLogs from "./pages/WeeklyLogs";
import Evaluations from "./pages/Evaluations";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    // BrowserRouter enables page navigation without reloading the whole React app.
    <BrowserRouter>
      <Navbar />

      <div className="main-layout">
        <Sidebar />
        <main className="content">
          {/* Each Route connects a URL path to the page component shown in the main content area. */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weeklyLogs" element={<WeeklyLogs />} />
            <Route path="/Evaluations" element={<Evaluations />} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="/Settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
