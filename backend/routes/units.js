const makeCrudRouter = require('../middleware/crudRouter');
const { Unit } = require('../models/Lookups');
module.exports = makeCrudRouter(Unit);
