/**
 * Scrumdog
 */


const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const config = require('../config.json');
const models = require('./models');
const logger = require('./lib/logger');
const auth = require('./auth');

const apiRouter = require('./routes/apiv1');

const app = express();

// sessions via sequelize
app.use(session({
  secret: config.sessionSecret,
  store: new SequelizeStore({
    db: models.sequelize,
  }),
  resave: false,
  saveUninitialized: true,
}));

// static assets
app.use('/assets', express.static('client/build'));

// request logging
app.use(morgan('dev', {
  stream: logger.morganStream,
}));

// body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));


// instantiate our auth module
// (includes auth routes)
auth.init(app);

// api routes
app.use('/api/v1', apiRouter);

// all other routes, server the SPA
app.get('*', (req, res) => {
  res.status(200).sendFile('client/build/index.html', {
    root: `${__dirname}/../`,
  });
});


/**
 * Start the Express server
 */
const startExpress = () => {
  app.listen(process.env.PORT || 4040, () => {
    logger.info(`Scrumdog running on ${process.env.PORT || 4040}`);
  });
};

// you can pass --forcesync as the first argument to force a sync of the DB.
// todo - do this better, it's flaky.
models.sequelize.sync({
  force: process.argv[2] === '--forcesync',
}).then(startExpress);
