// server.js

import express from "express";
import { runAgent } from "./agentOllama.js";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await runAgent(message);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something broke" });
  }
});

app.listen(3000, () => {
  console.log("AI Agent running on http://localhost:3000");
});