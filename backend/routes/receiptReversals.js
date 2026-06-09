const express = require('express');
const router  = express.Router();
const { PaymentReceipt } = require('../models/Others');

router.post('/reverse', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required' });
    const receipt = await PaymentReceipt.findOne({ code: code.trim() }).populate('customer', 'name');
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
    if (receipt.status === 'Cancelled') return res.status(400).json({ error: 'Already reversed' });
    receipt.status = 'Cancelled';
    await receipt.save();
    res.json({ message: 'Reversed successfully', receipt });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
