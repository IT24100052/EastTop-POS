const express  = require('express');
const router   = express.Router();
const Invoice  = require('../models/Invoice');

router.get('/', async (req, res) => {
  try {
    const now        = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd   = new Date(todayStart.getTime() + 86400000);
    const ystStart   = new Date(todayStart.getTime() - 86400000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart  = new Date(now.getFullYear(), 0, 1);

    const agg = (match) => Invoice.aggregate([
      { $match: { ...match, status: { $ne: 'Reversed' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const [today, yesterday, monthly, annual] = await Promise.all([
      agg({ date: { $gte: todayStart, $lt: todayEnd } }),
      agg({ date: { $gte: ystStart, $lt: todayStart } }),
      agg({ date: { $gte: monthStart } }),
      agg({ date: { $gte: yearStart } }),
    ]);

    const sixAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlySalesChart = await Invoice.aggregate([
      { $match: { date: { $gte: sixAgo }, status: { $ne: 'Reversed' } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, total: { $sum: '$total' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      todaySales:       today[0]?.total     || 0,
      yesterdaySales:   yesterday[0]?.total || 0,
      monthlySales:     monthly[0]?.total   || 0,
      annualSales:      annual[0]?.total    || 0,
      monthlySalesChart,
      date: now
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
