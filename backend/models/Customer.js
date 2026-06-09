const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  code:         { type: String, unique: true },
  customCode:   { type: String, maxlength: 50 },
  name:         { type: String, required: true, trim: true, maxlength: 100 },
  address:      { type: String, maxlength: 200 },
  city:         { type: String, maxlength: 50 },
  tel:          { type: String, maxlength: 20, match: /^[\d\-\+\(\)]*$/ },
  email:        { type: String, maxlength: 100, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  creditAmount: { type: Number, default: 0, min: 0 },
  creditLimit:  { type: Number, default: 0, min: 0 },
  salesRep:     { type: mongoose.Schema.Types.ObjectId, ref: 'SalesRep' },
  route:        { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  active:       { type: Boolean, default: true }
}, { timestamps: true });

customerSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      const count = await mongoose.model('Customer').countDocuments();
      this.code = '2001' + String(count + 1).padStart(7, '0');
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Customer', customerSchema);
