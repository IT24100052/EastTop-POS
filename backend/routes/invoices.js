const express = require('express');
const router  = express.Router();
const Invoice = require('../models/Invoice');
const Item    = require('../models/Item');

const buildQuery = (req) => {
  const { search, customer, status } = req.query;
  const q = {};
  if (customer) q.customer = customer;
  if (status)   q.status   = status;
  if (search)   q.$or = [{ code: new RegExp(search, 'i') }];
  return q;
};

router.get('/', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = buildQuery(req);
    const skip  = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Invoice.find(query).populate('customer', 'name code').populate('items.item', 'name code').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Invoice.countDocuments(query)
    ]);
    res.json({ data, total, page, limit });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name code tel')
      .populate('items.item', 'name code retailPrice');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    // Validate items array exists
    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    // Check stock availability
    for (const line of req.body.items) {
      if (line.item) {
        const item = await Item.findById(line.item);
        if (!item) return res.status(404).json({ error: `Item ${line.item} not found` });
        if (item.stockQuantity < line.qty) {
          return res.status(400).json({ error: `Insufficient stock for ${item.name}. Available: ${item.stockQuantity}, Required: ${line.qty}` });
        }
      }
    }

    const invoice = new Invoice(req.body);
    await invoice.save();
    
    // Decrement stock
    for (const line of invoice.items) {
      if (line.item) {
        await Item.findByIdAndUpdate(line.item, { $inc: { stockQuantity: -line.qty } });
      }
    }
    res.status(201).json(invoice);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    
    // Restore stock on deletion
    for (const line of invoice.items) {
      if (line.item) {
        await Item.findByIdAndUpdate(line.item, { $inc: { stockQuantity: line.qty } });
      }
    }
    
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice deleted and stock restored' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
