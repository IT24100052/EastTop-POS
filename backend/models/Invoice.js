const mongoose = require('mongoose');
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
      const count = await mongoose.model('Invoice').countDocuments();
      this.code = '1001' + String(count + 1).padStart(7, '0');
    }

    // Auto-resolve customer name
    if (typeof this.customer === 'string' && this.customer.length > 0 && !mongoose.Types.ObjectId.isValid(this.customer)) {
      const Customer = mongoose.model('Customer');
      let entity = await Customer.findOne({ name: new RegExp('^' + this.customer + '$', 'i') });
      if (!entity) entity = await Customer.create({ name: this.customer });
      this.customer = entity._id;
    }
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model('Invoice', invoiceSchema);
