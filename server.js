import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "CASPER AI",
    hasApiKey: Boolean(process.env.OPENAI_API_KEY)
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is missing in Vercel Environment Variables."
      });
    }

    const message = String(req.body?.message ?? "").trim();
    const mode = String(req.body?.mode ?? "general");

    if (!message) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    const instructionsByMode = {
      general: "Answer clearly and helpfully. Reply in the same language as the user.",
      explain: "Explain very simply, step by step. Reply in the same language as the user.",
      ideas: "Give creative and practical ideas. Reply in the same language as the user.",
      study: "Help with studying using clear explanations and examples. Reply in the same language as the user."
    };

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are CASPER AI, a friendly personal assistant. " +
        (instructionsByMode[mode] ?? instructionsByMode.general),
      input: message
    });

    return res.json({
      answer: response.output_text || "No answer was returned."
    });
  } catch (error) {
    console.error("Chat API error:", error);

    const status =
      Number.isInteger(error?.status) && error.status >= 400
        ? error.status
        : 500;

    return res.status(status).json({
      error:
        error?.status === 401
          ? "The OpenAI API key is invalid."
          : error?.message || "The AI request failed."
    });
  }
});

// Vercel detects this default export as the Express application.
export default app;

// This runs only on your own computer, not on Vercel.
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`CASPER AI running at http://localhost:${port}`);
  });
}
