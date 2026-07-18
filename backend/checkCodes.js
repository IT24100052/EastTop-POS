const mongoose = require('mongoose');
const Customer = require('./models/Customer');
require('dotenv').config({ path: './.env' });

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bizxpos');
  
  const customers = await Customer.find({ code: new RegExp('^2001') }).select('code').sort({ code: -1 }).limit(10);
  console.log("Top 10 highest codes alphabetically:");
  customers.forEach(c => console.log(c.code));

  process.exit(0);
}

check().catch(console.error);
