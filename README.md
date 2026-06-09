# EastTop POS — Version 2.0.0
**Solution By IRM**  
Contact: info@irm.lk | www.irm.lk | Copyright © IRM 2026

---

## Overview
EastTop POS is a full-featured Point of Sale system built with:
- **Frontend:** Vanilla HTML5 / CSS3 / JavaScript (single-file SPA, no build step required)
- **Backend:** Node.js + Express.js REST API
- **Database:** MongoDB (via Mongoose ODM)

---

## Features
| Module | Screens |
|---|---|
| Dashboard | Sales stats, 6-month bar chart, monthly donut chart |
| Invoice | POS invoice with item search, discount, cash/credit/cheque payment |
| Stock | GRN, Paid GRN, Stock Transfer, Sales Order, Sales Quotation, Stock Issue |
| Item & Services | Items, Category, Brand, Bin Location, Colour, Unit |
| Customers | Customer list, Payment Receipt, Receipt Reversal, Sales Return, Cheque Receipts (In Hand / In Process / Returned) |
| Suppliers | Supplier list, Payment Vouchers, Voucher Reversal, Purchase Return, Cheque Vouchers |
| Sales Rep | Sales Reps, Routes |
| Reports | Supplier, Purchase, Stock, Summary (Day-End/Daily/Monthly), Customer, Sales, Expenses, Cheque Receipt, Cheque Voucher, Payment |
| Barcode | Barcode generator and printer |
| Expenses | Expenses list, Expense Types |

---

## Prerequisites
| Tool | Version |
|---|---|
| Node.js | v18 or above |
| npm | v9 or above |
| MongoDB | v6 or above (local or Atlas) |

---

## Installation

### 1. Clone / Extract the project
```
easttop/
├── backend/
├── frontend/
├── README.md
└── .gitignore
```

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Configure environment
Edit `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/easttop
PORT=5000
JWT_SECRET=your_secret_key_here
```

For **MongoDB Atlas**, replace MONGO_URI with your connection string:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/easttop?retryWrites=true&w=majority
```

#### Start the backend
```bash
node server.js
```
You should see:
```
MongoDB connected successfully
EastTop server running on http://localhost:5000
Default admin created: admin / admin123
```

> The system **auto-creates** the default admin user (`admin` / `admin123`) on first run.

### 3. Frontend Setup
No build step needed. Just open the file:

```bash
# Option A: Open directly in browser
open frontend/index.html

# Option B: Serve with a simple HTTP server
npx serve frontend
# or
python3 -m http.server 3000 --directory frontend
```

Then visit `http://localhost:3000` (or just open the HTML file directly).

---

## Default Login
| Field | Value |
|---|---|
| Username | admin |
| Password | admin123 |

> **Demo Mode:** If the backend is not running, the frontend falls back to demo mode automatically. You can still log in with `admin / admin123` and browse the UI.

---

## API Endpoints
All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register new user |
| GET | /api/dashboard | Dashboard stats |
| GET/POST/PUT/DELETE | /api/invoices | Invoices |
| GET/POST/PUT/DELETE | /api/items | Items & Services |
| GET/POST/PUT/DELETE | /api/categories | Item Categories |
| GET/POST/PUT/DELETE | /api/brands | Item Brands |
| GET/POST/PUT/DELETE | /api/units | Item Units |
| GET/POST/PUT/DELETE | /api/colours | Item Colours |
| GET/POST/PUT/DELETE | /api/bin-locations | Bin Locations |
| GET/POST/PUT/DELETE | /api/customers | Customers |
| GET/POST/PUT/DELETE | /api/suppliers | Suppliers |
| GET/POST/PUT/DELETE | /api/grn | Goods Received Notes |
| GET/POST/PUT/DELETE | /api/stock-transfer | Stock Transfers |
| GET/POST/PUT/DELETE | /api/sales-orders | Sales Orders |
| GET/POST/PUT/DELETE | /api/sales-quotations | Sales Quotations |
| GET/POST/PUT/DELETE | /api/stock-issues | Stock Issues |
| GET/POST/PUT/DELETE | /api/payment-receipts | Payment Receipts |
| POST | /api/receipt-reversals/reverse | Reverse a receipt |
| GET/POST/PUT/DELETE | /api/sales-returns | Sales Returns |
| GET/POST/PUT/DELETE | /api/cheque-receipts | Cheque Receipts |
| GET/POST/PUT/DELETE | /api/payment-vouchers | Payment Vouchers |
| POST | /api/voucher-reversals/reverse | Reverse a voucher |
| GET/POST/PUT/DELETE | /api/purchase-returns | Purchase Returns |
| GET/POST/PUT/DELETE | /api/cheque-vouchers | Cheque Vouchers |
| GET/POST/PUT/DELETE | /api/sales-reps | Sales Reps |
| GET/POST/PUT/DELETE | /api/routes-list | Routes |
| GET/POST/PUT/DELETE | /api/expenses | Expenses |
| GET/POST/PUT/DELETE | /api/expenses-types | Expense Types |
| GET | /api/reports/summary/day-end | Day-end summary |
| GET | /api/reports/sales | Sales report |
| GET | /api/reports/purchase | Purchase report |
| GET | /api/reports/stock | Stock report |
| GET | /api/reports/customer | Customer report |
| GET | /api/reports/expenses | Expenses report |

---

## Keyboard Shortcuts (Invoice page)
| Key | Action |
|---|---|
| F1 | Cash Payment |
| F4 | Go to Sales Return |
| F5 | Apply Discount |
| F11 | Full Screen |
| Escape | Close Modal |
| ALT+C | Go to Add Customer |
| ALT+O | Go to Sales Orders |

---

## Project Structure
```
easttop/
├── backend/
│   ├── middleware/
│   │   └── crudRouter.js       # Generic CRUD router factory
│   ├── models/
│   │   ├── Customer.js
│   │   ├── GRN.js
│   │   ├── Invoice.js
│   │   ├── Item.js
│   │   ├── Lookups.js          # Category, Brand, Unit, Colour, BinLocation
│   │   ├── Others.js           # All other models
│   │   ├── Supplier.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── binLocations.js
│   │   ├── brands.js
│   │   ├── categories.js
│   │   ├── chequeReceipts.js
│   │   ├── chequeVouchers.js
│   │   ├── colours.js
│   │   ├── customers.js
│   │   ├── dashboard.js
│   │   ├── expenses.js
│   │   ├── expensesTypes.js
│   │   ├── grn.js
│   │   ├── invoices.js
│   │   ├── items.js
│   │   ├── paymentReceipts.js
│   │   ├── paymentVouchers.js
│   │   ├── purchaseReturns.js
│   │   ├── receiptReversals.js
│   │   ├── reports.js
│   │   ├── routes.js
│   │   ├── salesOrders.js
│   │   ├── salesQuotations.js
│   │   ├── salesReps.js
│   │   ├── salesReturns.js
│   │   ├── stockIssues.js
│   │   ├── stockTransfer.js
│   │   ├── suppliers.js
│   │   ├── units.js
│   │   └── voucherReversals.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   └── index.html              # Complete SPA (no build needed)
├── .gitignore
└── README.md
```

---

## Troubleshooting

**MongoDB not connecting**
- Make sure MongoDB is running: `sudo systemctl start mongod`
- Check your MONGO_URI in `.env`

**CORS errors in browser**
- Ensure backend is running on port 5000
- The frontend's API base URL is `http://localhost:5000/api` — update at the top of `index.html` if your backend runs elsewhere

**Port already in use**
- Change `PORT=5000` in `.env` to another port
- Update the `const API = 'http://localhost:5000/api'` line in `frontend/index.html`

---

## License
Proprietary — Solution By IRM. All rights reserved.
