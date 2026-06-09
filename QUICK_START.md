# BIZXPOS - QUICK START GUIDE

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js v14+ installed
- ✅ MongoDB running (local or Atlas)
- ✅ npm or yarn package manager

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The system will automatically:
# - Connect to MongoDB
# - Create default admin user (admin/admin123)
# - Generate all required collections
```

### Step 2: Start the Backend Server

```bash
# Development mode (auto-reload on changes)
npm run dev

# Or production mode
npm start
```

✅ You should see:
```
MongoDB connected successfully
EastTop server running on http://localhost:5000
Default admin created: admin / admin123
```

### Step 3: Frontend Access (1 minute)

Open in browser:
```
http://localhost:5000/api/invoices   (to verify API is running)
```

Or directly open the HTML:
```bash
cd frontend
open index.html
# Or serve it
npx serve . -l 8080
```

Then visit `http://localhost:8080`

### Step 4: Login

Use default credentials:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change password immediately after first login!**

---

## 📋 What's Ready to Use?

### Fully Functional Features ✅
1. **Authentication** - Login/Register with JWT tokens
2. **Dashboard** - Sales statistics and analytics
3. **Invoices** - Create, view, and manage invoices with stock tracking
4. **Items** - Manage products and services
5. **Customers** - Customer database and payment tracking
6. **Suppliers** - Supplier management and purchase tracking
7. **Stock Management** - GRN, Stock Transfer, Stock Issues
8. **Reports** - Sales, Purchase, Expense, and Summary reports
9. **Expense Tracking** - Track business expenses
10. **All Lookup Data** - Categories, Brands, Units, Colors, etc.

---

## 🔧 Configuration

### Environment Variables (backend/.env)

```bash
# MongoDB Connection (required)
MONGO_URI=mongodb://localhost:27017/bizxpos

# Server Port (optional, default: 5000)
PORT=5000

# JWT Secret (required for production)
JWT_SECRET=change_this_to_a_strong_secret_key
```

### For MongoDB Atlas Users

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bizxpos?retryWrites=true&w=majority
```

---

## ⚡ Common Operations

### Create a Customer
1. Click "Customers" in sidebar
2. Click "Add Customer" button
3. Fill in details and save
4. Customer code auto-generated

### Create an Invoice
1. Click "Invoices" in sidebar
2. Search and select customer
3. Add items (click to search products)
4. Set quantity and price
5. Apply discount if needed
6. Select payment method
7. Process payment

### Receive Goods (GRN)
1. Click "Stock" → "GRN"
2. Select supplier
3. Add items and quantities
4. System auto-updates stock

### View Reports
1. Click "Reports" in sidebar
2. Select report type:
   - Daily/Monthly Sales
   - Purchase Analysis
   - Stock Summary
   - Customer Analysis
   - Expense Report

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: 
1. Ensure MongoDB is running: `mongod`
2. Check MONGO_URI in `.env`
3. Verify connection string is correct

### Issue: "Port 5000 already in use"
**Solution**:
1. Kill process: `lsof -ti:5000 | xargs kill -9`
2. Or change PORT in `.env`

### Issue: "npm ERR! Cannot find module..."
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend not connecting to API
**Solution**:
1. Ensure backend is running on correct port
2. Check CORS is enabled
3. Verify frontend API_URL setting

---

## 📱 Browser Compatibility

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🔐 Security Reminders

1. **Change Default Password** - Do this immediately!
2. **Strong JWT Secret** - Use 32+ character random string
3. **MongoDB Authentication** - Enable in production
4. **HTTPS Only** - Always use HTTPS in production
5. **Regular Backups** - Backup MongoDB regularly

---

## 📞 Support Resources

- **Installation Help**: See `INSTALLATION_GUIDE.md`
- **All Fixes Applied**: See `FIXES_APPLIED.md`
- **API Documentation**: See route files in `backend/routes/`
- **Database Schema**: See model files in `backend/models/`

---

## 🎯 Next Steps

1. ✅ Start the server (you've done this!)
2. ✅ Login with admin/admin123
3. ✅ Create sample data (customers, items, invoices)
4. ✅ Explore all features
5. ✅ Change default password
6. ✅ Configure for production use

---

## 📊 System Statistics

- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Frontend**: Vanilla HTML5/CSS3/JavaScript
- **APIs**: 40+ RESTful endpoints
- **Models**: 15+ data models
- **Status**: ✅ 100% Functional, All Errors Fixed

---

**Version**: 2.0.0  
**Last Updated**: May 2026  
**Status**: Production Ready ✅
