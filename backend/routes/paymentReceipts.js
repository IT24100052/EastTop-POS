const makeCrudRouter = require('../middleware/crudRouter');
const { PaymentReceipt } = require('../models/Others');
module.exports = makeCrudRouter(PaymentReceipt, ['customer']);
