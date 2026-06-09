const mongoose = require('mongoose');
const supplierSchema = new mongoose.Schema({
  code:         { type: String, unique: true },
  customCode:   { type: String, maxlength: 50 },
  name:         { type: String, required: true, trim: true, maxlength: 100 },
  nic:          { type: String, maxlength: 50 },
  address:      { type: String, maxlength: 200 },
  city:         { type: String, maxlength: 50 },
  tel1:         { type: String, maxlength: 20, match: /^[\d\-\+\(\)]*$/ },
  tel2:         { type: String, maxlength: 20, match: /^[\d\-\+\(\)]*$/ },
  email:        { type: String, maxlength: 100, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  debitBalance: { type: Number, default: 0, min: 0 },
  active:       { type: Boolean, default: true }
}, { timestamps: true });

supplierSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      const count = await mongoose.model('Supplier').countDocuments();
      this.code = '2111' + String(count + 1).padStart(7, '0');
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Supplier', supplierSchema);
