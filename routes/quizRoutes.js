const express = require('express');
const router = express.Router();
const { generateQuizFromNote, getQuizzes } = require('../controllers/quizController');

router.post('/generate', generateQuizFromNote);
router.get('/:userId', getQuizzes);

module.exports = router;