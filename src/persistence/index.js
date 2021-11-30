require('dotenv').config();
if (process.env.NODE_ENV !== 'development') module.exports = require('./psql');
else module.exports = require('./sqlite');
