const express = require('express');
const router = express.Router();
const { summarizeNote, getSummariesByUser } = require('../controllers/summarizeController');

router.post('/', summarizeNote);
// GET /api/summaries/:userId
router.get('/:userId', getSummariesByUser);

module.exports = router;
