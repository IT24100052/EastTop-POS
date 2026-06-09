const makeCrudRouter = require('../middleware/crudRouter');
const { Brand } = require('../models/Lookups');
module.exports = makeCrudRouter(Brand);
