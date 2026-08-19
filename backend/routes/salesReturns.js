const express = require('express');
const router = express.Router();
const makeCrudRouter = require('../middleware/crudRouter');
const { SalesReturn } = require('../models/Others');
const Invoice = require('../models/Invoice');
const Item = require('../models/Item');

// 1. Get previous returns for an invoice
router.get('/by-invoice/:id', async (req, res) => {
  try {
    const returns = await SalesReturn.find({ invoice: req.params.id });
    res.json(returns);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Custom POST to validate quantities and restore stock
router.post('/', async (req, res) => {
  try {
    const { invoice: invoiceId, customer, items, date } = req.body;
    
    if (!invoiceId) return res.status(400).json({ error: 'Invoice ID is required' });
    if (!items || !items.length) return res.status(400).json({ error: 'At least one item is required' });

    // Fetch original invoice
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    // Fetch all previous returns for this invoice
    const previousReturns = await SalesReturn.find({ invoice: invoiceId });
    const returnedQtyMap = {};
    for (const pr of previousReturns) {
      for (const line of pr.items) {
        const itemId = line.item.toString();
        returnedQtyMap[itemId] = (returnedQtyMap[itemId] || 0) + line.qty;
      }
    }

    // Map original invoice quantities
    const soldQtyMap = {};
    for (const line of invoice.items) {
      if (line.item) {
        soldQtyMap[line.item.toString()] = line.qty;
      }
    }

    let totalAmount = 0;
    const returnItems = [];

    // Validate requested items
    for (const reqItem of items) {
      const itemId = reqItem.item;
      const reqQty = Number(reqItem.qty);
      
      if (!itemId || isNaN(reqQty) || reqQty <= 0) continue;

      const sold = soldQtyMap[itemId] || 0;
      const previouslyReturned = returnedQtyMap[itemId] || 0;
      const availableToReturn = sold - previouslyReturned;

      if (reqQty > availableToReturn) {
        return res.status(400).json({ error: `Return quantity for item ${itemId} exceeds available quantity.` });
      }

      const unitPrice = Number(reqItem.unitPrice) || 0;
      const lineTotal = reqQty * unitPrice;
      totalAmount += lineTotal;

      returnItems.push({
        item: itemId,
        qty: reqQty,
        unitPrice: unitPrice,
        total: lineTotal
      });
    }

    if (returnItems.length === 0) {
      return res.status(400).json({ error: 'No valid items to return' });
    }

    // Create the Sales Return
    const salesReturn = new SalesReturn({
      customer,
      invoice: invoiceId,
      date: date || new Date(),
      amount: totalAmount,
      items: returnItems
    });

    // Wait for autoCode pre('save') and save
    await salesReturn.save();

    // Restore stock
    for (const line of returnItems) {
      if (line.item) {
        await Item.findByIdAndUpdate(line.item, { $inc: { stockQuantity: line.qty } });
      }
    }

    res.status(201).json(salesReturn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Custom DELETE to deduct stock back (if a return is deleted)
router.delete('/:id', async (req, res) => {
  try {
    const salesReturn = await SalesReturn.findById(req.params.id);
    if (!salesReturn) return res.status(404).json({ error: 'Sales return not found' });

    // Deduct the returned stock back since we are deleting the return
    for (const line of salesReturn.items) {
      if (line.item) {
        await Item.findByIdAndUpdate(line.item, { $inc: { stockQuantity: -line.qty } });
      }
    }

    await SalesReturn.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully and stock deducted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Use generic crud for GET / and GET /:id
const crud = makeCrudRouter(SalesReturn, ['customer', 'invoice', 'items.item']);
router.use('/', crud);

module.exports = router;
