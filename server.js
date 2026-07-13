import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    const mode = String(req.body?.mode || "general");

    if (!message) {
      return res.status(400).json({ error: "לא נשלחה שאלה." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "חסר OPENAI_API_KEY בקובץ .env."
      });
    }

    const modeInstructions = {
      general: "ענה בעברית פשוטה, ברורה ונעימה.",
      search: "ענה בעברית והשתמש בחיפוש באינטרנט כאשר צריך מידע עדכני.",
      explain: "הסבר בעברית פשוטה מאוד, שלב אחר שלב.",
      ideas: "תן רעיונות יצירתיים ומעשיים בעברית.",
      study: "עזור בלימודים בעברית, עם הסבר ברור ודוגמאות."
    };

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      instructions:
        "אתה CASPER AI, עוזר אישי בעברית. " +
        (modeInstructions[mode] || modeInstructions.general) +
        " אל תמציא עובדות. כאשר מידע עדכני נדרש, השתמש בחיפוש באינטרנט.",
      tools: mode === "search" ? [{ type: "web_search" }] : [],
      input: message
    });

    res.json({
      answer: response.output_text || "לא התקבלה תשובה."
    });
  } catch (error) {
    console.error(error);

    const message =
      error?.status === 401
        ? "מפתח ה-API לא תקין."
        : error?.message || "אירעה שגיאה בחיבור ל-AI.";

    res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`CASPER AI running at http://localhost:${port}`);
});
