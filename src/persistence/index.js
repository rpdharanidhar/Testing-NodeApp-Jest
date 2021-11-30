require('dotenv').config();
if (process.env.NODE_ENV === 'prod') module.exports = require('./psql');
else module.exports = require('./sqlite');
