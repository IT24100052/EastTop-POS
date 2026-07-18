const mongoose = require('mongoose');
const { generateNextCode } = require('../utils/codeGenerator');
const grnSchema = new mongoose.Schema({
  code:        { type: String, unique: true },
  supplier:    { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  invoiceCode: { type: String, unique: true, sparse: true, trim: true },
  date:        { type: Date, default: Date.now },
  grnDate:     { type: Date, default: Date.now },
  items: {
    type: [{
      item:        { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      description: String,
      qty:         { type: Number, min: 0 },
      unitCost:    { type: Number, min: 0 },
      total:       Number
    }],
    default: []
  },
  total:   { type: Number, default: 0 },
  status:  { type: String, enum: ['Pending', 'Paid', 'Partial'], default: 'Pending' },
  notes:   String
}, { timestamps: true });

grnSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      this.code = await generateNextCode('GRN', '2120', 7);
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('GRN', grnSchema);
