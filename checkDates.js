const mongoose = require('mongoose');
const Invoice = require('./backend/models/Invoice');
require('dotenv').config({ path: './backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bizxpos');
  const invoices = await Invoice.find().sort({ createdAt: -1 }).limit(3);
  console.log("Latest Invoices:");
  invoices.forEach(i => {
    console.log(`Code: ${i.code}, Date: ${i.date}, Total: ${i.total}, Status: ${i.status}`);
  });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);
  
  console.log("\nDashboard Query Dates:");
  console.log(`Now: ${now}`);
  console.log(`todayStart: ${todayStart}`);
  console.log(`todayEnd: ${todayEnd}`);

  const todaySales = await Invoice.aggregate([
    { $match: { date: { $gte: todayStart, $lt: todayEnd }, status: { $ne: 'Reversed' } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
  
  console.log("\nToday Sales aggregate result:", todaySales);

  process.exit(0);
}

check().catch(console.error);
