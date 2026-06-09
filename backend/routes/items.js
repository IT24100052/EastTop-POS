const express = require('express');
const router  = express.Router();
const Item    = require('../models/Item');

router.get('/', async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const query  = search ? {
      $or: [
        { name:    new RegExp(search, 'i') },
        { code:    new RegExp(search, 'i') },
        { barcode: new RegExp(search, 'i') }
      ]
    } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Item.find(query).populate('category brand unit colour binLocation').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Item.countDocuments(query)
    ]);
    res.json({ data, total, page, limit });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('category brand unit colour binLocation');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    // Remove empty ObjectId refs
    const body = { ...req.body };
    ['category','brand','unit','colour','binLocation'].forEach(f => { if (!body[f]) delete body[f]; });
    const item = new Item(body);
    await item.save();
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    ['category','brand','unit','colour','binLocation'].forEach(f => { if (!body[f]) delete body[f]; });
    const item = await Item.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
