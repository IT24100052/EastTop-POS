const mongoose = require('mongoose');
const { generateNextCode } = require('../utils/codeGenerator');
const invoiceItemSchema = new mongoose.Schema({
  item:        { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  description: String,
  qty:         { type: Number, required: true, min: 0 },
  unitPrice:   { type: Number, required: true, min: 0 },
  discountPct: { type: Number, default: 0 },
  discountAmt: { type: Number, default: 0 },
  total:       { type: Number, required: true }
});
const invoiceSchema = new mongoose.Schema({
  code:          { type: String, unique: true },
  customer:      { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  salesRep:      { type: mongoose.Schema.Types.ObjectId, ref: 'SalesRep' },
  date:          { type: Date, default: Date.now },
  items:         { type: [invoiceItemSchema], required: true },
  subtotal:      { type: Number, default: 0 },
  discountAmt:   { type: Number, default: 0 },
  total:         { type: Number, default: 0 },
  paidAmount:    { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['CASH', 'CREDIT', 'CHEQUE'], default: 'CASH' },
  status:        { type: String, enum: ['Active', 'Pending', 'Reversed'], default: 'Active' },
  notes:         String
}, { timestamps: true });
invoiceSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      this.code = await generateNextCode('Invoice', '1001', 7);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
Invoice.resolveRefs = async function(body) {
  if (typeof body.customer === 'string' && body.customer.length > 0 && !mongoose.Types.ObjectId.isValid(body.customer)) {
    const Customer = mongoose.model('Customer');
    let entity = await Customer.findOne({ name: new RegExp('^' + body.customer + '$', 'i') });
    if (!entity) throw new Error(`Customer "${body.customer}" not found. Please create the customer first.`);
    body.customer = entity._id;
  }
};
module.exports = Invoice;
