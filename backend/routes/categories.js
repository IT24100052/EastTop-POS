const makeCrudRouter = require('../middleware/crudRouter');
const { Category } = require('../models/Lookups');
module.exports = makeCrudRouter(Category);
