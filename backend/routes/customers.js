const express  = require('express');
const router   = express.Router();
const Customer = require('../models/Customer');

router.get('/', async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const query  = search ? {
      $or: [
        { name:       new RegExp(search, 'i') },
        { code:       new RegExp(search, 'i') },
        { customCode: new RegExp(search, 'i') },
        { city:       new RegExp(search, 'i') }
      ]
    } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Customer.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Customer.countDocuments(query)
    ]);
    res.json({ data, total, page, limit });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const c = await Customer.findById(req.params.id);
    if (!c) return res.status(404).json({ error: 'Customer not found' });
    res.json(c);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.salesRep) delete body.salesRep;
    if (!body.route) delete body.route;
    const c = new Customer(body);
    await c.save();
    res.status(201).json(c);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.salesRep) delete body.salesRep;
    if (!body.route) delete body.route;
    const c = await Customer.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!c) return res.status(404).json({ error: 'Customer not found' });
    res.json(c);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
