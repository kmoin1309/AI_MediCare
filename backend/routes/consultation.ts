import express from 'express';
import { Consultation, FeeStructure } from '../models/Consultation';

const router = express.Router();

// Get consultations with search and pagination
router.get('/consultations', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = search
      ? {
          $or: [
            { patientId: new RegExp(search as string, 'i') },
            { date: new RegExp(search as string, 'i') }
          ]
        }
      : {};

    const consultations = await Consultation.find(query)
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations' });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const totalConsultations = await Consultation.countDocuments();
    const completed = await Consultation.countDocuments({ status: 'completed' });
    const avgDuration = await Consultation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$duration' } } }
    ]);

    const weeklyData = await Consultation.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%U', date: '$createdAt' } },
          scheduled: { 
            $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 4 }
    ]);

    res.json({
      totalConsultations,
      completionRate: (completed / totalConsultations) * 100,
      avgDuration: avgDuration[0]?.avg || 0,
      weeklyData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// Fee structure endpoints
router.get('/fees', async (req, res) => {
  try {
    const fees = await FeeStructure.find();
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fee structures' });
  }
});

export default router;
