/**
 * Seed script – inserts Customers from the user-supplied screenshot.
 * Run:  node seedCustomers.js
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

const CUSTOMERS = [
  { name: 'Cash', code: 'CASH', creditBalance: -4588367.75 },
  { code: '2001000002', customCode: '001', name: 'ARUL RAJ', city: 'KALUWANCHIKUDY', creditBalance: 0 },
  { code: '2001000003', customCode: '-', name: 'PUSHPA AKKA', city: 'KOTTAIKALLAR', tel1: '772662651', creditBalance: 27400 },
  { code: '2001000004', customCode: '003', name: 'THAYA', city: 'KALUTHAVALAI', tel1: '776525038', creditBalance: 23425 },
  { code: '2001000005', customCode: '004', name: 'SEGAR ANNA STORS', city: 'ERUVIL', tel1: '776967300', creditBalance: 0 },
  { code: '2001000006', customCode: '005', name: 'MURUGAN UTHAYAN', city: 'KALUVANCHIKUDY MARKET', tel1: '771351796', creditBalance: 41000 },
  { code: '2001000007', customCode: '006', name: 'ONTHACHIMADAM SHOP', city: 'ONTHACHIMADAM', tel1: '771959198', creditBalance: 0 },
  { code: '2001000008', customCode: '007', name: 'MURUGAN', city: 'MAHILOOR', tel1: '770551972', creditBalance: 0 },
  { code: '2001000009', customCode: '008', name: 'LOGESH', city: 'MAHILOOR', creditBalance: 0 },
  { code: '2001000010', customCode: '009', name: 'THIRUTHANI', city: 'MAHILOOR', tel1: '776948677', creditBalance: 21900 },
];

async function customerExists(name) {
  const res = await get(`/customers?search=${encodeURIComponent(name)}&limit=5`);
  return (res.data || []).find(c => c.name === name);
}

async function main() {
  console.log('\n════════════════════════════════════════');
  console.log('  EastTop POS — Customer Data Seeder');
  console.log('════════════════════════════════════════\n');

  console.log('👥  Seeding Customers…');
  let custOk = 0, custSkip = 0;
  for (const cust of CUSTOMERS) {
    const exists = await customerExists(cust.name);
    if (exists) {
      console.log(`  ↩  SKIP  ${cust.name} (already exists)`);
      custSkip++;
      continue;
    }
    const result = await post('/customers', cust);
    if (result) {
      console.log(`  ✅ ADD   ${cust.name} – Code: ${cust.code}`);
      custOk++;
    }
  }
  console.log(`\n  Customers done: ${custOk} added, ${custSkip} skipped.\n`);

  console.log('════════════════════════════════════════');
  console.log('  ✔  Seeding complete!');
  console.log('════════════════════════════════════════\n');
}

main().catch(console.error);
