const express  = require('express');
const router   = express.Router();
const GRN      = require('../models/GRN');
const Supplier = require('../models/Supplier');
const Item     = require('../models/Item');

router.get('/', async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status;
    const query  = {};
    if (status) query.status = status;
    if (search) query.$or = [{ code: new RegExp(search, 'i') }, { invoiceCode: new RegExp(search, 'i') }];
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      GRN.find(query).populate('supplier', 'name code').skip(skip).limit(limit).sort({ createdAt: -1 }),
      GRN.countDocuments(query)
    ]);
    res.json({ data, total, page, limit });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const grn = await GRN.findById(req.params.id).populate('supplier').populate('items.item');
    if (!grn) return res.status(404).json({ error: 'Not found' });
    res.json(grn);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    
    // Validate items array exists
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }
    
    // If supplier sent as name string, find it
    if (body.supplierName && !body.supplier) {
      const sup = await Supplier.findOne({ name: new RegExp('^' + body.supplierName + '$', 'i') });
      if (sup) {
        body.supplier = sup._id;
      } else {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      delete body.supplierName;
    }
    
    const grn = new GRN(body);
    await grn.save();
    
    // Increment stock for items in GRN
    for (const line of grn.items) {
      if (line.item) {
        await Item.findByIdAndUpdate(line.item, { $inc: { stockQuantity: line.qty } });
      }
    }
    
    res.status(201).json(grn);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    
    // If supplier sent as name string, find it
    if (body.supplierName && !body.supplier) {
      const sup = await Supplier.findOne({ name: new RegExp('^' + body.supplierName + '$', 'i') });
      if (sup) {
        body.supplier = sup._id;
      }
      delete body.supplierName;
    }
    
    const grn = await GRN.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!grn) return res.status(404).json({ error: 'Not found' });
    res.json(grn);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const grn = await GRN.findById(req.params.id);
    if (!grn) return res.status(404).json({ error: 'Not found' });
    
    // Decrement stock when GRN is deleted
    for (const line of grn.items) {
      if (line.item) {
        await Item.findByIdAndUpdate(line.item, { $inc: { stockQuantity: -line.qty } });
      }
    }
    
    await GRN.findByIdAndDelete(req.params.id);
    res.json({ message: 'GRN deleted and stock adjusted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
