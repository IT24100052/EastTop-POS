const makeCrudRouter = require('../middleware/crudRouter');
const { Colour } = require('../models/Lookups');
module.exports = makeCrudRouter(Colour);
