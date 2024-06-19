// const https = require('https');

// const options = {
//   hostname: 'polar-ip-check.onrender.com',
//   port: 443,
//   path: '/',
//   method: 'GET'
// };

// const req = https.request(options, (res) => {
//   let data = '';

//   console.log('Response Code:', res.statusCode);

//   res.on('data', (chunk) => {
//     data += chunk;
//   });

//   res.on('end', () => {
//     console.log('Response Data:', data);
//   });
// });

// req.on('error', (error) => {
//   console.error('Error:', error);
// });

// req.end();

const http = require('http');
const compression = require('compression');
const express = require('express');

const db = require('./persistence');
const app = express();
const swaggerDocument = require('../swagger.json');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');

require('dotenv').config();

const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const getItem = require('./routes/getItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    '/api-docs',
    function (req, res, next) {
        swaggerDocument.servers[0].url = `${req.protocol}://${req.get('host')}`;
        req.swaggerDoc = swaggerDocument;
        if (process.env.NODE_ENV === 'development')
            console.log(swaggerDocument);
        next();
    },
    swaggerUI.serve,
    swaggerUI.setup(),
);

app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.get('/items/:id', getItem);
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

server.listen(process.env.PORT || 9090);

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon

module.exports = server;

