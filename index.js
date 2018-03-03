const express = require('express');
const app = express();

// declare and instantiate routes 
const genres = require('./routes/genres');
const home = require('./routes/home');

const Joi = require('joi');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');

// instantiate loggers and assign name-space
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

// instantiate custom middleware
const log = require('./middleware/logger');
const auth = require('./middleware/authenticate');

// activate Pug middleware
app.set('view engine', 'pug');
app.set('views', './views');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use(express.static('public'));
app.use(log);
app.use(auth);

// attach routes
app.use('/api/genres', genres);
app.use('/', home);

// Config
console.log('Application name: ' + config.get('name'));
console.log('Mail server: ' + config.get('mail.host'));
console.log('Password: ' + config.get('mail.password'));

if (app.get('env')==='development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled.');
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));