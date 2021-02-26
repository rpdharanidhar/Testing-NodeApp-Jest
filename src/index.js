const express = require('express');
const helmet = require('helmet');
const path = require('path');
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'static')));
app.listen(3000, () => console.log('Listening on port 3000'));
