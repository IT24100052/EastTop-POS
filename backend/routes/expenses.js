const express = require('express');
const router  = express.Router();
const { Expense, ExpenseType } = require('../models/Others');

// Helper: resolve typeName string to ExpenseType ObjectId
async function resolveType(body) {
  if (body.typeName && !body.type) {
    let expType = await ExpenseType.findOne({ name: new RegExp('^' + body.typeName.trim() + '$', 'i') });
    if (!expType) expType = await ExpenseType.create({ name: body.typeName.trim() });
    body.type = expType._id;
    delete body.typeName;
  }
}

router.get('/', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const query = {};
    if (search) query.remarks = new RegExp(search, 'i');
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Expense.find(query).populate('type').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Expense.countDocuments(query)
    ]);
    res.json({ data, total, page, limit });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Expense.findById(req.params.id).populate('type');
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    await resolveType(body);
    if (!body.type) return res.status(400).json({ error: 'Expense type is required' });
    const item = new Expense(body);
    await item.save();
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    await resolveType(body);
    const item = await Expense.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
