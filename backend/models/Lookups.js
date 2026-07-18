const mongoose = require('mongoose');
const { generateNextCode } = require('../utils/codeGenerator');

const makeSchema = (prefix) => {
  const schema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 }
  }, { timestamps: true });

  schema.pre('save', async function (next) {
    try {
      if (!this.code) {
        this.code = await generateNextCode(this.constructor, prefix, 7);
      }
      next();
    } catch (err) {
      next(err);
    }
  });
  return schema;
};

const Category    = mongoose.model('Category',    makeSchema('2031'));
const Brand       = mongoose.model('Brand',       makeSchema('2051'));
const Colour      = mongoose.model('Colour',      makeSchema('2091'));
const BinLocation = mongoose.model('BinLocation', makeSchema('2081'));

const unitSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true, trim: true, maxlength: 100 }
}, { timestamps: true });
unitSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      this.code = await generateNextCode('Unit', '2061', 7);
    }
    next();
  } catch (err) {
    next(err);
  }
});
const Unit = mongoose.model('Unit', unitSchema);

module.exports = { Category, Brand, Unit, Colour, BinLocation };
