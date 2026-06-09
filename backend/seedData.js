const mongoose = require('mongoose');
const { Category, Brand, Unit, Colour, BinLocation } = require('./models/Lookups');
const Item = require('./models/Item');
const Customer = require('./models/Customer');
const Supplier = require('./models/Supplier');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/easttop';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Unit.deleteMany({}),
      Colour.deleteMany({}),
      BinLocation.deleteMany({}),
      Customer.deleteMany({}),
      Supplier.deleteMany({}),
      Item.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create Admin
    const hash = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hash, role: 'admin' });
    console.log('Added Admin User: admin / admin123');

    // 1. Categories
    const categories = [];
    for (const name of ['Rice', 'Grains', 'Fertilizer', 'Services']) {
      categories.push(await Category.create({ name }));
    }
    console.log('Added Categories');

    // 2. Brands
    const brands = [];
    for (const name of ['Premium Gold', 'EcoHarvest', 'IRM']) {
      brands.push(await Brand.create({ name }));
    }
    console.log('Added Brands');

    // 3. Units
    const units = [];
    for (const name of ['KG', '50KG Bag', 'Packet', 'Hour']) {
      units.push(await Unit.create({ name }));
    }
    console.log('Added Units');

    // 4. Colours
    const colours = [];
    for (const name of ['White', 'Red', 'Brown']) {
      colours.push(await Colour.create({ name }));
    }
    console.log('Added Colours');

    // 5. Bin Locations
    const bins = [];
    for (const name of ['Warehouse A', 'Store Room 1', 'Processing Area']) {
      bins.push(await BinLocation.create({ name }));
    }
    console.log('Added Bin Locations');

    // 6. Customers
    const customers = [];
    for (const c of [
      { name: 'Amila Perera', tel: '0712345678', city: 'Colombo' },
      { name: 'Nimal Silva', tel: '0778765432', city: 'Kandy' },
      { name: 'Walking Customer', tel: '0000000000', city: 'Local' }
    ]) {
      customers.push(await Customer.create(c));
    }
    console.log('Added Customers');

    // 7. Suppliers
    const suppliers = [];
    for (const s of [
      { name: 'Global Agri Supplies', tel1: '0112233445' },
      { name: 'Fertilizer Corp', tel1: '0115566778' }
    ]) {
      suppliers.push(await Supplier.create(s));
    }
    console.log('Added Suppliers');

    // 8. Items
    await Item.create({ 
      name: 'Samba Rice 50KG', 
      type: 'Product', 
      wholesalePrice: 4500, 
      retailPrice: 5200, 
      category: categories[0]._id, 
      brand: brands[0]._id, 
      unit: units[1]._id 
    });
    await Item.create({ 
      name: 'Keeri Samba 50KG', 
      type: 'Product', 
      wholesalePrice: 5800, 
      retailPrice: 6500, 
      category: categories[0]._id, 
      brand: brands[0]._id, 
      unit: units[1]._id 
    });
    await Item.create({ 
      name: 'Rice Milling Service', 
      type: 'Service', 
      wholesalePrice: 500, 
      retailPrice: 600, 
      category: categories[3]._id, 
      unit: units[3]._id 
    });
    console.log('Added Sample Items');

    console.log('Seeding complete!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
