const { sequelize, RankingItem } = require('./models');
const express = require('express');

const router = express.Router();

// Create ranking item
router.post('/ranking', async (req, res) => {
  try {
    const { name, time } = req.body;
    if (!name || typeof time !== 'number') {
      return res.status(400).json({ error: 'Name and time are required.' });
    }

    const newItem = await RankingItem.create({
      name,
      time_seconds: time,
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all ranking items sorted by time_seconds ascending
router.get('/ranking', async (req, res) => {
  try {
    const items = await RankingItem.findAll({
      order: [['time_seconds', 'ASC']],
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
