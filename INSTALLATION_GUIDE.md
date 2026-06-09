# BizXPOS Installation Guide

## Prerequisites

- **Node.js**: Version 14.0.0 or higher
- **MongoDB**: Version 4.4 or higher
- **npm**: Version 6.0 or higher

## Installation Steps

### 1. Clone or Download Project
```bash
cd bizxpos
```

### 2. Backend Setup

#### 2.1 Install Backend Dependencies
```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables
Copy the `.env.example` file to `.env` and update the values:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
MONGO_URI=mongodb://localhost:27017/bizxpos
PORT=5000
JWT_SECRET=your_secret_key_here
```

#### 2.3 Start MongoDB
Make sure MongoDB is running:
```bash
# On Windows with MongoDB installed
net start MongoDB

# Or run MongoDB manually
mongod
```

#### 2.4 Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:5000`

### 3. Frontend Setup

#### 3.1 Start Frontend Server
```bash
cd frontend
npx serve . -l 8080
```

Or install serve globally:
```bash
npm install -g serve
serve . -l 8080
```

The frontend will be available at `http://localhost:8080`

## Default Login Credentials

**Username**: `admin`
**Password**: `admin123`

> ⚠️ **Important**: Change the default password immediately after first login!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Core Modules
- `/api/items` - Item management
- `/api/customers` - Customer management
- `/api/suppliers` - Supplier management
- `/api/invoices` - Invoice management
- `/api/grn` - Goods Received Notes
- `/api/categories` - Product categories
- `/api/brands` - Product brands
- `/api/units` - Product units
- `/api/colours` - Color options
- `/api/bin-locations` - Storage bin locations
- `/api/sales-orders` - Sales orders
- `/api/stock-transfer` - Stock transfers
- `/api/payment-receipts` - Payment receipts
- `/api/payment-vouchers` - Payment vouchers
- `/api/expenses` - Expense tracking
- And more...

## Database Collections

The system automatically creates the following MongoDB collections:

- `users` - User accounts
- `invoices` - Sales invoices
- `items` - Products/Services
- `customers` - Customer records
- `suppliers` - Supplier records
- `grns` - Goods Received Notes
- `categories` - Product categories
- `brands` - Product brands
- `units` - Units of measurement
- `colours` - Color specifications
- `binlocations` - Storage locations
- And other related collections

## Troubleshooting

### MongoDB Connection Error
**Error**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**: 
- Ensure MongoDB is running
- Check if MongoDB is listening on the correct port
- Update `MONGO_URI` in `.env` if using different host/port

### Port Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
- Change the PORT in `.env` to an available port
- Or kill the process using the port

### npm Dependencies Issue
**Error**: `Cannot find module 'express'`

**Solution**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
bizxpos/
├── backend/
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── server.js         # Express server setup
│   ├── seedData.js       # Database seeding script
│   ├── package.json      # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── package.json      # Frontend info
│   └── public/           # Static assets
└── README.md             # Project documentation
```

## Features

### Implemented
✅ User authentication with JWT
✅ Invoice generation and management
✅ Stock management
✅ Customer and Supplier management
✅ Payment receipts and vouchers
✅ Expense tracking
✅ Sales reports
✅ Dashboard with analytics
✅ Goods Received Notes (GRN)
✅ Sales orders and quotations
✅ Cheque receipt and voucher management

### Data Validation
✅ Schema validation on all models
✅ Field type checking
✅ Min/Max value validation
✅ Email and phone number validation
✅ Unique constraints on codes
✅ Error handling for all endpoints

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Request validation
- Error handling without exposing sensitive data
- Unique code generation for all entities
- Data integrity with MongoDB transactions support

## Best Practices

1. **Backup Database**: Regularly backup your MongoDB database
2. **Change Defaults**: Change the default admin password
3. **Environment Variables**: Never commit `.env` file to version control
4. **HTTPS**: Use HTTPS in production
5. **JWT Secret**: Use a strong, random JWT secret in production
6. **Database**: Use MongoDB Atlas or secure MongoDB instance in production

## Support

For issues or questions, please refer to the developer documentation or contact the development team.

---
**Version**: 2.0.0
**Last Updated**: May 2026
**Developed by**: IRM Solutions
