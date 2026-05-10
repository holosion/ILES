import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar">

            <h2>Dashboard</h2>

            <ul className="sidebar-links">

                <li>
                    <Link to="/">Home</Link>
                </li>

                <li>
                    <Link to="/weeklyLogs">Weekly Logs</Link>
                </li>

                <li>
                    <Link to="/Evaluations">Evaluations</Link>
                </li>

                <li>
                    <Link to="/Reports">Reports</Link>
                </li>
                

                <li>
                    <Link to="/Settings">Settings</Link>
                </li>


            </ul>
        </div>
        
    );
}

export default Sidebar;