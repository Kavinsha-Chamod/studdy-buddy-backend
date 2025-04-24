const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  noteId: { type: String, required: true },
  title: String,
  content: String,
  summary: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Summary', summarySchema);