const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const loggingMiddleware = require('./middleware/loggingMiddleware');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

app.use(express.json());
app.use(loggingMiddleware);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/easttop';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err.message));

app.use('/api/auth',              require('./routes/auth'));
app.use('/api/dashboard',         require('./routes/dashboard'));
app.use('/api/invoices',          require('./routes/invoices'));
app.use('/api/items',             require('./routes/items'));
app.use('/api/categories',        require('./routes/categories'));
app.use('/api/brands',            require('./routes/brands'));
app.use('/api/units',             require('./routes/units'));
app.use('/api/colours',           require('./routes/colours'));
app.use('/api/bin-locations',     require('./routes/binLocations'));
app.use('/api/customers',         require('./routes/customers'));
app.use('/api/suppliers',         require('./routes/suppliers'));
app.use('/api/grn',               require('./routes/grn'));
app.use('/api/stock-transfer',    require('./routes/stockTransfer'));
app.use('/api/sales-orders',      require('./routes/salesOrders'));
app.use('/api/sales-quotations',  require('./routes/salesQuotations'));
app.use('/api/stock-issues',      require('./routes/stockIssues'));
app.use('/api/payment-receipts',  require('./routes/paymentReceipts'));
app.use('/api/receipt-reversals', require('./routes/receiptReversals'));
app.use('/api/sales-returns',     require('./routes/salesReturns'));
app.use('/api/cheque-receipts',   require('./routes/chequeReceipts'));
app.use('/api/payment-vouchers',  require('./routes/paymentVouchers'));
app.use('/api/voucher-reversals', require('./routes/voucherReversals'));
app.use('/api/purchase-returns',  require('./routes/purchaseReturns'));
app.use('/api/cheque-vouchers',   require('./routes/chequeVouchers'));
app.use('/api/sales-reps',        require('./routes/salesReps'));
app.use('/api/routes-list',       require('./routes/routes'));
app.use('/api/reports',           require('./routes/reports'));
app.use('/api/expenses',          require('./routes/expenses'));
app.use('/api/expenses-types',    require('./routes/expensesTypes'));

const errorHandler = require('./middleware/errorHandler');

// Use error handling middleware
app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('EastTop server running on http://localhost:' + PORT));
