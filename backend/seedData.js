/**
 * Seed script – inserts Items and GRNs from the user-supplied screenshots.
 * Run:  node seedData.js
 * Make sure the backend is running on port 5000.
 */

const BASE = 'http://localhost:5000/api';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) {
    console.warn(`  ⚠ POST ${path} → ${res.status}: ${json.error || JSON.stringify(json)}`);
    return null;
  }
  return json;
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

// ─────────────────────────────────────────────
// 1.  ITEMS  (from Item & Service screenshot)
// ─────────────────────────────────────────────
const ITEMS = [
  { type: 'Service',  barcode: '0001',  name: 'outstanding' },
  { type: 'Product',  barcode: 'SRHP05', name: 'ISARAH-7 PONNY 5KG'  },
  { type: 'Product',  barcode: 'SRHP10', name: 'SARAH-7 PONNY 10KG'  },
  { type: 'Product',  barcode: 'SRHP25', name: 'SARAH-7 PONNY 25KG'  },
  { type: 'Product',  barcode: 'SRHU05', name: 'SARAH-7 USUAL 5KG'   },
  { type: 'Product',  barcode: 'SRHU10', name: 'SARAH-7 USUAL 10KG'  },
  { type: 'Product',  barcode: 'SRHU25', name: 'SARAH-7 USUAL 25KG'  },
  { type: 'Product',  barcode: 'SRHM05', name: 'SARAH-7 MUTTHU 5KG'  },
  { type: 'Product',  barcode: 'SRHM10', name: 'SARAH-7 MUTTHU 10KG' },
  { type: 'Product',  barcode: 'SRHM25', name: 'SARAH-7 MUTTHU 25KG' },
];

// ─────────────────────────────────────────────
// 2.  GRN RECORDS  (from both GRN screenshots)
// ─────────────────────────────────────────────
// Codes from screenshot are fixed; we pass them explicitly.
const GRNS = [
  // Screenshot 1 (0000-00-00 dates → null, kept as now)
  { code: '212011000001', supplierName: 'outstanding',    invoiceCode: '001',   total:       50.00 },
  { code: '212011000002', supplierName: 'outstanding',    invoiceCode: '002',   total:       20.00 },
  { code: '212011000003', supplierName: 'outstanding',    invoiceCode: '003',   total:        7.00 },
  { code: '212011000004', supplierName: 'IQBAL RICE MILL', invoiceCode: '5099', total: 17825000.00 },
  { code: '212011000005', supplierName: 'IQBAL RICE MILL', invoiceCode: '5098', total:  8650000.00 },
  { code: '212011000006', supplierName: 'IQBAL RICE MILL', invoiceCode: '5097', total:  3200000.00 },
  { code: '212011000007', supplierName: 'IQBAL RICE MILL', invoiceCode: '5096', total:   658085.00 },
  { code: '212011000008', supplierName: 'IQBAL RICE MILL', invoiceCode: '5094', total:  3200000.00 },
  { code: '212011000009', supplierName: 'IQBAL RICE MILL', invoiceCode: '5095', total:  1460000.00 },
  { code: '212011000010', supplierName: 'IQBAL RICE MILL', invoiceCode: '5093', total:  9451000.00 },
  // Screenshot 2 (with actual dates)
  { code: '212011000029', supplierName: 'IQBAL RICE MILL', invoiceCode: '3333',  date: '2023-11-29', grnDate: '2023-11-29', total: 0 },
  { code: '212011000031', supplierName: 'IQBAL RICE MILL', invoiceCode: '1213',  date: '2025-05-04', grnDate: '2025-05-04', total: 186700000.00 },
  { code: '212011000032', supplierName: 'IQBAL RICE MILL', invoiceCode: '5566',  date: '2025-05-04', grnDate: '2025-05-04', total:  32168000.00 },
  { code: '212011000033', supplierName: 'IQBAL RICE MILL', invoiceCode: '1212',  date: '2025-08-06', grnDate: '2025-08-06', total:  26750000.00 },
  { code: '212011000034', supplierName: 'IQBAL RICE MILL', invoiceCode: '11556', date: '2025-11-13', grnDate: '2025-11-13', total:  33117800.00 },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

async function ensureSupplier(name) {
  // Check if already exists
  const list = await get(`/suppliers?search=${encodeURIComponent(name)}&limit=5`);
  const existing = (list.data || []).find(s => s.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing._id;
  const created = await post('/suppliers', { name });
  return created ? created._id : null;
}

async function itemExists(barcode) {
  const res = await get(`/items?search=${encodeURIComponent(barcode)}&limit=5`);
  return (res.data || []).find(i => i.barcode === barcode);
}

async function grnExists(code) {
  const res = await get(`/grn?search=${encodeURIComponent(code)}&limit=5`);
  return (res.data || []).find(g => g.code === code);
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function main() {
  console.log('\n════════════════════════════════════════');
  console.log('  EastTop POS — Data Seeder');
  console.log('════════════════════════════════════════\n');

  // ── Step 1: Seed Items
  console.log('📦  Seeding Items & Services…');
  let itemOk = 0, itemSkip = 0;
  for (const item of ITEMS) {
    const exists = await itemExists(item.barcode);
    if (exists) {
      console.log(`  ↩  SKIP  ${item.barcode} – ${item.name} (already exists)`);
      itemSkip++;
      continue;
    }
    const result = await post('/items', item);
    if (result) {
      console.log(`  ✅ ADD   ${item.barcode} – ${item.name}`);
      itemOk++;
    }
  }
  console.log(`\n  Items done: ${itemOk} added, ${itemSkip} skipped.\n`);

  // ── Step 2: Ensure suppliers exist
  console.log('🏪  Ensuring Suppliers…');
  const supplierIds = {};
  const supplierNames = [...new Set(GRNS.map(g => g.supplierName))];
  for (const name of supplierNames) {
    const id = await ensureSupplier(name);
    supplierIds[name] = id;
    console.log(`  ${id ? '✅' : '❌'} ${name}`);
  }
  console.log();

  // ── Step 3: Seed GRNs
  console.log('📋  Seeding GRN Records…');
  let grnOk = 0, grnSkip = 0;
  for (const grn of GRNS) {
    const exists = await grnExists(grn.code);
    if (exists) {
      console.log(`  ↩  SKIP  ${grn.code} – inv:${grn.invoiceCode} (already exists)`);
      grnSkip++;
      continue;
    }
    const supplierId = supplierIds[grn.supplierName];
    if (!supplierId) {
      console.log(`  ❌ SKIP  ${grn.code} – supplier not found`);
      continue;
    }
    const body = {
      code:        grn.code,
      supplier:    supplierId,
      invoiceCode: grn.invoiceCode,
      total:       grn.total,
      items:       [],
    };
    if (grn.date)    body.date    = grn.date;
    if (grn.grnDate) body.grnDate = grn.grnDate;

    const result = await post('/grn', body);
    if (result) {
      console.log(`  ✅ ADD   ${grn.code}  inv:${grn.invoiceCode}  total:${grn.total.toLocaleString()}`);
      grnOk++;
    }
  }
  console.log(`\n  GRNs done: ${grnOk} added, ${grnSkip} skipped.\n`);

  console.log('════════════════════════════════════════');
  console.log('  ✔  Seeding complete!');
  console.log('════════════════════════════════════════\n');
}

main().catch(console.error);
