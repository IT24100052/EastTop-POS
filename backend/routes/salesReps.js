const makeCrudRouter = require('../middleware/crudRouter');
const { SalesRep } = require('../models/Others');
module.exports = makeCrudRouter(SalesRep);
