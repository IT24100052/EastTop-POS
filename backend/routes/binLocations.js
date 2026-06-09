const makeCrudRouter = require('../middleware/crudRouter');
const { BinLocation } = require('../models/Lookups');
module.exports = makeCrudRouter(BinLocation);
