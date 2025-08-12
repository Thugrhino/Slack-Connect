const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // ✅ Allow requests from frontend
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Slack Connect Backend is running...");
});

// ✅ Get Slack channels
app.get("/slack/channels", async (req, res) => {
  try {
    const response = await axios.get("https://slack.com/api/conversations.list", {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
    });

    if (!response.data.ok) {
      return res.status(500).json({ error: response.data.error });
    }

    // Send back just the id and name of channels
    const channels = response.data.channels.map(ch => ({
      id: ch.id,
      name: ch.name,
    }));

    res.json(channels);
  } catch (error) {
    console.error("Error fetching channels:", error);
    res.status(500).json({ error: "Failed to fetch channels" });
  }
});

// ✅ Send message to Slack
app.post("/slack/send-message", async (req, res) => {
  const { channel, text } = req.body;

  if (!channel || !text) {
    return res.status(400).json({ error: "Channel and text are required" });
  }

  try {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      { channel, text },
      {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.ok) {
      return res.status(500).json({ error: response.data.error });
    }

    res.json({ success: true, message: "Message sent to Slack!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
