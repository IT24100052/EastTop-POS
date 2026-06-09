const mongoose = require('mongoose');

const autoCode = (prefix) => async function(next) {
  try {
    if (!this.code) {
      const count = await this.constructor.countDocuments();
      this.code = prefix + String(count + 1).padStart(7, '0');
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Stock Transfer
const stockTransferSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  locationFrom: { type: String, required: true },
  locationTo: { type: String, required: true },
  date: { type: Date, default: Date.now },
  remarks: String,
  items: { type: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, qty: { type: Number, min: 0 } }], required: true }
}, { timestamps: true });
stockTransferSchema.pre('save', autoCode('3001'));

// Sales Order
const salesOrderSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, default: Date.now },
  items: { type: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, qty: { type: Number, min: 0 }, unitPrice: { type: Number, min: 0 }, total: { type: Number, min: 0 } }], required: true },
  total: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });
salesOrderSchema.pre('save', autoCode('4001'));

// Sales Quotation
const salesQuotationSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, default: Date.now },
  items: { type: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, qty: { type: Number, min: 0 }, unitPrice: { type: Number, min: 0 }, total: { type: Number, min: 0 } }], required: true },
  total: { type: Number, default: 0, min: 0 }
}, { timestamps: true });
salesQuotationSchema.pre('save', autoCode('4520'));

// Stock Issue
const stockIssueSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  referenceNo: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  date: { type: Date, default: Date.now },
  items: { type: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, qty: { type: Number, min: 0 }, total: { type: Number, min: 0 } }], required: true },
  total: { type: Number, default: 0, min: 0 }
}, { timestamps: true });
stockIssueSchema.pre('save', autoCode('5001'));

// Payment Receipt
const paymentReceiptSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  total: { type: Number, default: 0, min: 0 },
  settleAmt: { type: Number, default: 0, min: 0 },
  overPayment: { type: Number, default: 0, min: 0 },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Pending', 'Cancelled'], default: 'Active' },
  notes: String
}, { timestamps: true });
paymentReceiptSchema.pre('save', autoCode('2220'));

// Sales Return
const salesReturnSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  date: { type: Date, default: Date.now },
  amount: { type: Number, default: 0, min: 0 },
  items: { type: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, qty: { type: Number, min: 0 }, unitPrice: { type: Number, min: 0 }, total: { type: Number, min: 0 } }], required: true }
}, { timestamps: true });
salesReturnSchema.pre('save', autoCode('3020'));

// Cheque Receipt
const chequeReceiptSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  chequeNo: { type: String, required: true },
  bank: String,
  amount: { type: Number, default: 0, min: 0 },
  date: { type: Date, default: Date.now },
  depositDate: Date,
  status: { type: String, enum: ['hand', 'process', 'returned', 'cleared'], default: 'hand' }
}, { timestamps: true });
chequeReceiptSchema.pre('save', autoCode('3150'));

// Payment Voucher
const paymentVoucherSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  total: { type: Number, default: 0, min: 0 },
  settleAmt: { type: Number, default: 0, min: 0 },
  overPayment: { type: Number, default: 0, min: 0 },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Pending', 'Cancelled'], default: 'Active' }
}, { timestamps: true });
paymentVoucherSchema.pre('save', autoCode('5100'));

// Purchase Return
const purchaseReturnSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  returnDate: { type: Date, default: Date.now },
  items: { type: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, qty: { type: Number, min: 0 }, total: { type: Number, min: 0 } }], required: true },
  total: { type: Number, default: 0, min: 0 }
}, { timestamps: true });
purchaseReturnSchema.pre('save', autoCode('5200'));

// Cheque Voucher
const chequeVoucherSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  chequeNo: { type: String, required: true },
  bank: String,
  mobile: String,
  amount: { type: Number, default: 0, min: 0 },
  date: { type: Date, default: Date.now },
  depositDate: Date,
  status: { type: String, enum: ['hand', 'process', 'returned', 'cleared'], default: 'hand' }
}, { timestamps: true });
chequeVoucherSchema.pre('save', autoCode('5300'));

// Sales Rep
const salesRepSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  contactNo: { type: String, maxlength: 20, match: /^[\d\-\+\(\)]*$/ },
  email: { type: String, maxlength: 100, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
}, { timestamps: true });
salesRepSchema.pre('save', autoCode('2171'));

// Route
const routeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  from: { type: String, maxlength: 100 },
  to: { type: String, maxlength: 100 }
}, { timestamps: true });
routeSchema.pre('save', autoCode('2181'));

// Expense
const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseType', required: true },
  category: String,
  remarks: String,
  total: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

// Expense Type
const expenseTypeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true, trim: true, maxlength: 100 }
}, { timestamps: true });
expenseTypeSchema.pre('save', autoCode('2261'));

module.exports = {
  StockTransfer:  mongoose.model('StockTransfer',  stockTransferSchema),
  SalesOrder:     mongoose.model('SalesOrder',     salesOrderSchema),
  SalesQuotation: mongoose.model('SalesQuotation', salesQuotationSchema),
  StockIssue:     mongoose.model('StockIssue',     stockIssueSchema),
  PaymentReceipt: mongoose.model('PaymentReceipt', paymentReceiptSchema),
  SalesReturn:    mongoose.model('SalesReturn',    salesReturnSchema),
  ChequeReceipt:  mongoose.model('ChequeReceipt',  chequeReceiptSchema),
  PaymentVoucher: mongoose.model('PaymentVoucher', paymentVoucherSchema),
  PurchaseReturn: mongoose.model('PurchaseReturn', purchaseReturnSchema),
  ChequeVoucher:  mongoose.model('ChequeVoucher',  chequeVoucherSchema),
  SalesRep:       mongoose.model('SalesRep',       salesRepSchema),
  Route:          mongoose.model('Route',          routeSchema),
  Expense:        mongoose.model('Expense',        expenseSchema),
  ExpenseType:    mongoose.model('ExpenseType',    expenseTypeSchema),
};
