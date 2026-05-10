import { useState } from "react";

function WeeklyLogs() {

  const [week, setWeek] = useState("");

  const [activity, setActivity] = useState("");

  const [logs, setLogs] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  function handleSubmit(event) {

    event.preventDefault();

    const newLog = {
      week: week,
      activity: activity
    };

    if (editIndex !== null) {

      const updatedLogs = [...logs];

      updatedLogs[editIndex] = newLog;

      setLogs(updatedLogs);

      setEditIndex(null);

    }

    else {

      setLogs([...logs, newLog]);

    }

    setWeek("");

    setActivity("");

  }

  function deleteLog(indexToDelete) {

    const updatedLogs =
      logs.filter((log, index) =>
        index !== indexToDelete
      );

    setLogs(updatedLogs);

  }

  function editLog(index) {

    const selectedLog = logs[index];

    setWeek(selectedLog.week);

    setActivity(selectedLog.activity);

    setEditIndex(index);

  }

  return (
    <div className="weekly-layout">

      <div className="weekly-left">
        <h2>Weekly Logs</h2>

        <form onSubmit={handleSubmit}>

          <div>
            <label>Week Number</label>
            <br />
            <input
              type="number"
              value={week}
              onChange={(event) => setWeek(event.target.value)}
            />
          </div>

          <div>
            <label>Activity Done</label>
            <br />
            <textarea
              rows="5"
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
            />
          </div>

          <div>
            <button type="submit">
              {editIndex !== null ? "Update Log" : "Submit Log"}
            </button>
          </div>

        </form>

        {/* small preview cards for each log */}
        {logs.map((log, index) => (
          <div className="log-card" key={index}>
            <div><strong>Week {log.week}</strong></div>
            <div style={{marginTop:8}}>{log.activity}</div>
          </div>
        ))}

      </div>

      <div className="weekly-right">
        <h2>Submitted Logs</h2>

        <table className="logs-table">
          <thead>
            <tr>
              <th>Week</th>
              <th>Activity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.week}</td>
                <td>{log.activity}</td>
                <td><span className="status">Draft</span></td>
                <td>
                  <button onClick={() => editLog(index)}>Edit</button>
                  <button onClick={() => deleteLog(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default WeeklyLogs;