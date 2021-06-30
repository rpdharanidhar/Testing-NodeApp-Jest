const http = require('http');
const compression = require('compression');
const express = require('express');

const db = require('./persistence');
const app = express();
const swaggerDocument = require('../swagger.json');
const swaggerUI = require('swagger-ui-express');

require('dotenv').config();

const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

app.get('*', (req, res) => {
    res.redirect('/api-docs');
});

let server = http.createServer(app);

db.init()
    .then(() => {})
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

server.listen(3000 || process.env.PORT);

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon

module.exports = server;
