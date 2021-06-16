// CRIO_SOLUTION_START_MODULE_UNDERSTANDING_BASICS
// CRIO_SOLUTION_END_MODULE_UNDERSTANDING_BASICS
const nedb = require('nedb');
const users = new nedb({ filename: 'db/users.db', autoload: true })
const products = new nedb({ filename: 'db/products.db', autoload: true });

module.exports.users = users
module.exports.products = products