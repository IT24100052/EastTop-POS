const express = require('express');

const makeCrudRouter = (Model, populateFields = []) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const status = req.query.status;
      const query = {};
      if (search) query.$or = [
        { name: new RegExp(search, 'i') },
        { code: new RegExp(search, 'i') }
      ];
      if (status) query.status = status;
      const skip = (page - 1) * limit;
      let q = Model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
      if (populateFields.length) q = q.populate(populateFields.join(' '));
      const [data, total] = await Promise.all([q, Model.countDocuments(query)]);
      res.json({ data, total, page, limit });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.get('/:id', async (req, res) => {
    try {
      let q = Model.findById(req.params.id);
      if (populateFields.length) q = q.populate(populateFields.join(' '));
      const item = await q;
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.post('/', async (req, res) => {
    try {
      const item = new Model(req.body);
      await item.save();
      res.status(201).json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  router.put('/:id', async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  return router;
};

module.exports = makeCrudRouter;
