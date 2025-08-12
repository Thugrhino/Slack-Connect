import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";


export default function Home() {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    // simulate small delay before navigating to main page
    setTimeout(() => {
      navigate("/main", { replace: true });
    }, 500);
  };

  return (
    <div className="page home-page">
      <h1 className="title">Slack Connect</h1>

      <button
        className="connect-btn"
        onClick={handleConnect}
        disabled={connecting}
      >
        {connecting ? "Connecting..." : "Connect to Slack"}
      </button>
    </div>
  );
}
