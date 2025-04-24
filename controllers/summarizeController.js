const { OpenAI } = require("openai");
const Summary = require("../models/Summary");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const summarizeNote = async (req, res) => {
    console.log("Received request to summarize note");
    console.log("Request body:", req.body);
  
    const { userId, noteId, title, content } = req.body;
  
    if (!userId || !noteId || !title || !content) {
      return res
        .status(400)
        .json({ error: "userId, noteId, title, and content are required" });
    }
  
    try {
      const existingSummary = await Summary.findOne({ userId, noteId });
      if (existingSummary) {
        console.log("Summary already exists, returning from DB.");
        return res.status(200).json(existingSummary);
      }
      const prompt = `You are a helpful assistant that summarizes notes.
        Summarize the following note in valid **JSON format only** — no extra explanation or text. The summary should highlight key concepts in a brief paragraph.
        Summarize in JSON only:
        {
          "title": "${title}",
          "content": "${content}"
        }
        Respond like:
        {
          "summary": "..."
        }`;
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
  
      const json = JSON.parse(completion.choices[0].message.content);
      const newSummary = await Summary.create({
        userId,
        noteId,
        title,
        content,
        summary: json.summary,
      });
      res.status(201).json(newSummary);
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "OpenAI or DB error", details: err.message });
    }
  };
  

const getSummariesByUser = async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
  
    try {
      const summaries = await Summary.find({ userId }).sort({ createdAt: -1 });
      res.json(summaries);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to fetch summaries", details: err.message });
    }
  };

module.exports = { summarizeNote, getSummariesByUser };
