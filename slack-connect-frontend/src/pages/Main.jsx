import React, { useState, useEffect } from "react";
import "../styles/Main.css";
import axios from "axios";

export default function Main() {
  const [channels, setChannels] = useState([]);
  const [channel, setChannel] = useState("");
  const [message, setMessage] = useState("");
  const [scheduled, setScheduled] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [tempTime, setTempTime] = useState("");

  // ✅ Fetch channels from backend
  useEffect(() => {
    axios.get("http://localhost:3000/slack/channels")
      .then(res => setChannels(res.data))
      .catch(err => console.error("Error fetching channels", err));
  }, []);

  const handleSendNow = async () => {
  if (!channel || !message) {
    alert("Please select a channel and type a message.");
    return;
  }

  try {
    await axios.post("http://localhost:3000/slack/send-message", {

      channel: channel,
      text: message
    });
    alert(`Message sent to ${channel}: ${message}`);
    setMessage("");
  } catch (error) {
    alert("Error sending message: " + error.message);
  }
};


  const handleOpenSchedulePopup = () => {
    if (!channel || !message) {
      alert("Please select a channel and type a message first.");
      return;
    }
    setShowPopup(true);
  };

  const handleConfirmSchedule = () => {
    if (!tempTime) {
      alert("Please select a date and time.");
      return;
    }
    const newItem = {
      channel,
      message,
      time: tempTime
    };
    setScheduled((s) => [...s, newItem]);
    setMessage("");
    setTempTime("");
    setShowPopup(false);
  };

  const handleCancel = (i) => {
    setScheduled((s) => s.filter((_, idx) => idx !== i));
  };

  return (
    <div className="page main-page">
      <h1 className="title">Slack Connect</h1>
      <p className="sub">You are now connected to Slack</p>

      <div className="composer">
        <h2>Send a Message</h2>

        <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="">Select Channel</option>
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>
              #{ch.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="actions">
          <button className="pill" onClick={handleSendNow}>Send Now</button>
          <button className="pill" onClick={handleOpenSchedulePopup}>Schedule</button>
        </div>
      </div>

      {scheduled.length > 0 && (
        <div className="scheduled-list">
          <h3>Scheduled Messages</h3>
          <ul>
            {scheduled.map((s, i) => (
              <li key={i}>
                <div className="left">
                  <strong>{s.channel}</strong> — {s.message}
                  <div className="time">({s.time})</div>
                </div>
                <button className="cancel" onClick={() => handleCancel(i)}>Cancel</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Select Date & Time</h3>
            <input
              type="datetime-local"
              value={tempTime}
              onChange={(e) => setTempTime(e.target.value)}
            />
            <div className="popup-actions">
              <button className="pill" onClick={handleConfirmSchedule}>Done</button>
              <button className="pill cancel" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
