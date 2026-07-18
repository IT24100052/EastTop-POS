const mongoose = require('mongoose');
const { nameValidator, nicSchemaType, phoneSchemaType, emailSchemaType } = require('../utils/validators');
const { generateNextCode } = require('../utils/codeGenerator');

const customerSchema = new mongoose.Schema({
  code:         { type: String, unique: true },
  customCode:   { type: String, maxlength: 50, unique: true, sparse: true, trim: true },
  name:         { type: String, required: true, trim: true, maxlength: 100, validate: nameValidator },
  nic:          { ...nicSchemaType, required: true, unique: true },
  address:      { type: String, maxlength: 200 },
  city:         { type: String, maxlength: 50 },
  tel:          { ...phoneSchemaType, required: true, unique: true },
  email:        { ...emailSchemaType, required: true, unique: true },
  creditAmount: { type: Number, default: 0, min: 0 },
  creditLimit:  { type: Number, default: 0, min: 0 },
  salesRep:     { type: mongoose.Schema.Types.ObjectId, ref: 'SalesRep' },
  route:        { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  active:       { type: Boolean, default: true }
}, { timestamps: true });

customerSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      this.code = await generateNextCode('Customer', '2001', 7);
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Customer', customerSchema);
