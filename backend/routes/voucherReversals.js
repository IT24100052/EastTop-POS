const express = require('express');
const router  = express.Router();
const { PaymentVoucher } = require('../models/Others');

router.post('/reverse', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required' });
    const voucher = await PaymentVoucher.findOne({ code: code.trim() }).populate('supplier', 'name');
    if (!voucher) return res.status(404).json({ error: 'Voucher not found' });
    if (voucher.status === 'Cancelled') return res.status(400).json({ error: 'Already reversed' });
    voucher.status = 'Cancelled';
    await voucher.save();
    res.json({ message: 'Reversed successfully', voucher });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
