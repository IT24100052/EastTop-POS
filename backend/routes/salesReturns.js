const makeCrudRouter = require('../middleware/crudRouter');
const { SalesReturn } = require('../models/Others');
module.exports = makeCrudRouter(SalesReturn, ['customer']);
