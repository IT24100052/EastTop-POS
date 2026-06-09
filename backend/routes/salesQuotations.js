const makeCrudRouter = require('../middleware/crudRouter');
const { SalesQuotation } = require('../models/Others');
module.exports = makeCrudRouter(SalesQuotation, ['customer']);
