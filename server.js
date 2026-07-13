import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) {
      return res.status(400).json({ error: "No message provided." });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message
    });

    res.json({ answer: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
