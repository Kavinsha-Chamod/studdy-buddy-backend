const Quiz = require("../models/Quiz");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateQuizFromNote = async (req, res) => {
    console.log("Received request to generate quiz");
    console.log("Request body:", req.body);
    const { userId, noteId, title, content } = req.body;
  
    if (!userId || !noteId || !title || !content) {
      return res.status(400).json({ error: "userId, noteId, title, and content are required" });
    }
  
    try {
      const existingQuiz = await Quiz.find({ noteId });
  
      if (existingQuiz.length > 0) {
        console.log("Returning existing quiz from database");
        return res.status(200).json(existingQuiz);
      }
      const prompt = `You are a quiz generator for study notes.
  Given the following content, generate 5 multiple-choice questions in strict JSON format.
  Each question must include 4 options and clearly mark the correct answer.
  
  Respond in JSON like:
  [
    {
      "question": "...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B"
    }
  ]
  
  Note Title: ${title}
  Content: ${content}`;
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
  
      let raw = completion.choices[0].message.content.trim();
  
      if (raw.startsWith("```json")) {
        raw = raw.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (raw.startsWith("```")) {
        raw = raw.replace(/^```/, '').replace(/```$/, '').trim();
      }
  
      const quizArray = JSON.parse(raw);
  
      const savedQuizzes = await Quiz.insertMany(
        quizArray.map(q => ({
          userId,
          noteId,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      );
  
      res.status(201).json(savedQuizzes);
  
    } catch (err) {
      console.error("Quiz generation error:", err.message);
      res.status(500).json({ error: "Failed to generate or save quiz", details: err.message });
    }
  };  

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.params.userId });
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
};

module.exports = { generateQuizFromNote, getQuizzes };
