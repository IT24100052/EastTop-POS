const makeCrudRouter = require('../middleware/crudRouter');
const { SalesOrder } = require('../models/Others');
module.exports = makeCrudRouter(SalesOrder, ['customer']);
