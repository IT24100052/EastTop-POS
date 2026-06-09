const makeCrudRouter = require('../middleware/crudRouter');
const { StockIssue } = require('../models/Others');
module.exports = makeCrudRouter(StockIssue, ['customer']);
