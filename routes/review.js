const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get('/', (req, res) => {
  res.send('Review get');
});

// Add a beer.
router.get('/add/:id', (req, res) => {
  res.send('Review add');
});

module.exports = router;
