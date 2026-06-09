const makeCrudRouter = require('../middleware/crudRouter');
const { PaymentVoucher } = require('../models/Others');
module.exports = makeCrudRouter(PaymentVoucher, ['supplier']);
