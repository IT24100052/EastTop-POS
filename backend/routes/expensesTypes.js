const makeCrudRouter = require('../middleware/crudRouter');
const { ExpenseType } = require('../models/Others');
module.exports = makeCrudRouter(ExpenseType);
