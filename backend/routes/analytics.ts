import express from 'express';
import { Performance, Accuracy } from '../models/AIAnalytics';

const router = express.Router();

router.get('/performance', async (req, res) => {
  const { timeFrame } = req.query;
  const date = timeFrame === 'weekly' ? 
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : 
    new Date(Date.now() - 24 * 60 * 60 * 1000);

  const data = await Performance.find({ date: { $gte: date } });
  res.json(data);
});

router.get('/accuracy', async (req, res) => {
  const data = await Accuracy.find().sort({ date: -1 }).limit(5);
  res.json(data);
});

export default router;
