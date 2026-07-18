const mongoose = require('mongoose');
const Invoice = require('./models/Invoice');
require('dotenv').config({ path: './.env' });

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bizxpos');
  
  const dummyPayload = {
    items: [{
      description: "Test Item",
      qty: 1,
      unitPrice: 10000,
      total: 10000
    }],
    total: 10000,
    paymentMethod: "CASH",
    status: "Active"
  };

  try {
    const invoice = new Invoice(dummyPayload);
    await invoice.save();
    console.log("Invoice created:", invoice);
  } catch(e) {
    console.error("Error creating invoice:", e);
  }
  
  process.exit(0);
}

check().catch(console.error);
