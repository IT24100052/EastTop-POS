const mongoose = require('mongoose');
const { nicSchemaType, phoneSchemaType, emailSchemaType } = require('../utils/validators');
const { generateNextCode } = require('../utils/codeGenerator');

const supplierSchema = new mongoose.Schema({
  code:         { type: String, unique: true },
  customCode:   { type: String, maxlength: 50, unique: true, sparse: true, trim: true },
  name:         { type: String, required: true, trim: true, maxlength: 100 },
  nic:          { ...nicSchemaType, required: true, unique: true },
  address:      { type: String, maxlength: 200 },
  city:         { type: String, maxlength: 50 },
  tel1:         { ...phoneSchemaType, required: true, unique: true },
  tel2:         { ...phoneSchemaType, unique: true, sparse: true },
  email:        { ...emailSchemaType, required: true, unique: true },
  debitBalance: { type: Number, default: 0, min: 0 },
  active:       { type: Boolean, default: true }
}, { timestamps: true });

supplierSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      this.code = await generateNextCode('Supplier', '2111', 7);
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Supplier', supplierSchema);
