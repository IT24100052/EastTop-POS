const makeCrudRouter = require('../middleware/crudRouter');
const { ChequeReceipt } = require('../models/Others');
module.exports = makeCrudRouter(ChequeReceipt, ['customer']);
