const makeCrudRouter = require('../middleware/crudRouter');
const { StockTransfer } = require('../models/Others');
module.exports = makeCrudRouter(StockTransfer);
