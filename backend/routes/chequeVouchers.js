const makeCrudRouter = require('../middleware/crudRouter');
const { ChequeVoucher } = require('../models/Others');
module.exports = makeCrudRouter(ChequeVoucher, ['supplier']);
