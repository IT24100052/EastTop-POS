const express  = require('express');
const router   = express.Router();
const Supplier = require('../models/Supplier');

router.get('/', async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const query  = search ? {
      $or: [
        { name: new RegExp(search, 'i') },
        { code: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') }
      ]
    } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Supplier.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Supplier.countDocuments(query)
    ]);
    res.json({ data, total, page, limit });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const s = await Supplier.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Supplier not found' });
    res.json(s);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const s = new Supplier(req.body);
    await s.save();
    res.status(201).json(s);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const s = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ error: 'Supplier not found' });
    res.json(s);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
