require('dotenv').config();
if (process.env.PSQL_HOST) module.exports = require('./psql');
else module.exports = require('./sqlite');
