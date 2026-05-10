import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
//import DashboardCard from "./components/DashboardCard";

import Home from "./pages/Home";
import WeeklyLogs from "./pages/WeeklyLogs";
import Evaluations from "./pages/Evaluations";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
    <Navbar />

    <div className="main-layout">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/weeklyLogs" element={<WeeklyLogs />} />

          <Route path="/Evaluations" element={<Evaluations />} />

          <Route path="/Reports" element={<Reports />} />

          <Route path="/Settings" element={<Settings />} />

        </Routes>

      </div>

    </div>

    </BrowserRouter>


  );

}

export default App;