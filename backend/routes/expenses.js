const makeCrudRouter = require('../middleware/crudRouter');
const { Expense } = require('../models/Others');
module.exports = makeCrudRouter(Expense, ['type']);
