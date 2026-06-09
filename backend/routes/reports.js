const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const GRN = require('../models/GRN');
const Item = require('../models/Item');
const { Expense, PaymentReceipt, PaymentVoucher, ChequeReceipt, ChequeVoucher, SalesReturn } = require('../models/Others');

// Summary reports
router.get('/summary/day-end', async (req, res) => {
  try {
    const { date } = req.query;
    const d = date ? new Date(date) : new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(start.getTime() + 86400000);

    const [sales, receipts, expenses, returns] = await Promise.all([
      Invoice.aggregate([{ $match: { date: { $gte: start, $lt: end }, status: { $ne: 'Reversed' } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
      PaymentReceipt.aggregate([{ $match: { date: { $gte: start, $lt: end } } }, { $group: { _id: null, total: { $sum: '$settleAmt' } } }]),
      Expense.aggregate([{ $match: { date: { $gte: start, $lt: end } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      SalesReturn.aggregate([{ $match: { date: { $gte: start, $lt: end } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    res.json({
      sales: sales[0] || { total: 0, count: 0 },
      receipts: receipts[0]?.total || 0,
      expenses: expenses[0]?.total || 0,
      returns: returns[0]?.total || 0,
      date: start
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Stock report
router.get('/stock', async (req, res) => {
  try {
    const { location, page = 1, limit = 10 } = req.query;
    const query = location ? { location } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Item.find(query).populate('category brand').skip(Number(skip)).limit(Number(limit)),
      Item.countDocuments(query)
    ]);
    res.json({ data, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Sales report
router.get('/sales', async (req, res) => {
  try {
    const { from, to, customer, page = 1, limit = 10 } = req.query;
    const query = { status: { $ne: 'Reversed' } };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }
    if (customer) query.customer = customer;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Invoice.find(query).populate('customer').skip(Number(skip)).limit(Number(limit)).sort({ date: -1 }),
      Invoice.countDocuments(query)
    ]);
    res.json({ data, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Purchase report
router.get('/purchase', async (req, res) => {
  try {
    const { supplier, from, to, page = 1, limit = 10 } = req.query;
    const query = {};
    if (supplier) query.supplier = supplier;
    if (from || to) {
      query.grnDate = {};
      if (from) query.grnDate.$gte = new Date(from);
      if (to) query.grnDate.$lte = new Date(to);
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      GRN.find(query).populate('supplier').skip(Number(skip)).limit(Number(limit)).sort({ createdAt: -1 }),
      GRN.countDocuments(query)
    ]);
    res.json({ data, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Customer report
router.get('/customer', async (req, res) => {
  try {
    const Customer = require('../models/Customer');
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Customer.find().skip(Number(skip)).limit(Number(limit)),
      Customer.countDocuments()
    ]);
    res.json({ data, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Expenses report
router.get('/expenses', async (req, res) => {
  try {
    const { from, to, page = 1, limit = 10 } = req.query;
    const query = {};
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Expense.find(query).populate('type').skip(Number(skip)).limit(Number(limit)).sort({ date: -1 }),
      Expense.countDocuments(query)
    ]);
    res.json({ data, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Cheque receipt report
router.get('/cheque-receipt', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      ChequeReceipt.find(query).populate('customer').skip(Number(skip)).limit(Number(limit)).sort({ createdAt: -1 }),
      ChequeReceipt.countDocuments(query)
    ]);
    res.json({ data, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Cheque voucher report
router.get('/cheque-voucher', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      ChequeVoucher.find(query).populate('supplier').skip(Number(skip)).limit(Number(limit)).sort({ createdAt: -1 }),
      ChequeVoucher.countDocuments(query)
    ]);
    res.json({ data, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Payment report
router.get('/payment', async (req, res) => {
  try {
    const { from, to, page = 1, limit = 10 } = req.query;
    const query = {};
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }
    const skip = (page - 1) * limit;
    const [receipts, vouchers] = await Promise.all([
      PaymentReceipt.find(query).populate('customer').skip(Number(skip)).limit(Number(limit)).sort({ date: -1 }),
      PaymentVoucher.find(query).populate('supplier').skip(Number(skip)).limit(Number(limit)).sort({ date: -1 }),
    ]);
    res.json({ receipts, vouchers });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
