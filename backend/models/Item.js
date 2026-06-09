const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  code:          { type: String, unique: true },
  type:          { type: String, enum: ['Product', 'Service'], default: 'Product' },
  barcode:       String,
  description:   String,
  name:          { type: String, required: true, trim: true },
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand:         { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  unit:          { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  colour:        { type: mongoose.Schema.Types.ObjectId, ref: 'Colour' },
  binLocation:   { type: mongoose.Schema.Types.ObjectId, ref: 'BinLocation' },
  wholesalePrice:{ type: Number, default: 0, min: 0 },
  retailPrice:   { type: Number, default: 0, min: 0 },
  costPrice:     { type: Number, default: 0, min: 0 },
  reorderLevel:  { type: Number, default: 0, min: 0 },
  stockQuantity: { type: Number, default: 0, min: 0 },
  location:      String,
  active:        { type: Boolean, default: true }
}, { timestamps: true });

async function resolveRefs(doc) {
  try {
    const refs = [
      { field: 'category',    model: 'Category' },
      { field: 'brand',       model: 'Brand' },
      { field: 'unit',        model: 'Unit' },
      { field: 'colour',      model: 'Colour' },
      { field: 'binLocation', model: 'BinLocation' }
    ];
    for (const r of refs) {
      const val = doc[r.field];
      if (typeof val === 'string' && val.length > 0 && !mongoose.Types.ObjectId.isValid(val)) {
        const Model = mongoose.model(r.model);
        let entity = await Model.findOne({ name: new RegExp('^' + val + '$', 'i') });
        if (!entity) entity = await Model.create({ name: val });
        doc[r.field] = entity._id;
      }
    }
  } catch (err) {
    console.error('Error resolving refs:', err.message);
    throw err;
  }
}

itemSchema.pre('save', async function (next) {
  try {
    if (!this.code) {
      const count = await mongoose.model('Item').countDocuments();
      this.code = 'ITEM' + String(count + 1).padStart(6, '0');
    }
    await resolveRefs(this);
    next();
  } catch (err) {
    next(err);
  }
});

itemSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    await resolveRefs(update);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Item', itemSchema);
