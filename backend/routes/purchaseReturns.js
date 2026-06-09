const makeCrudRouter = require('../middleware/crudRouter');
const { PurchaseReturn } = require('../models/Others');
module.exports = makeCrudRouter(PurchaseReturn, ['supplier']);
