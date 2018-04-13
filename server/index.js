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

const apiRouter = require('./routes/apiv1');

const app = express();

app.use(session({
  secret: config.sessionSecret,
  store: new SequelizeStore({
    db: models.sequelize,
  }),
  resave: false,
  saveUninitialized: true,
}));


app.use('/assets', express.static('client/build'));
app.use(morgan('dev', {
  stream: logger.morganStream,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));


// only one route
app.get('/', (req, res) => {
  res.status(200).sendFile('client/build/index.html', {
    root: `${__dirname}/../`,
  });
});

// api routes
app.use('/api/v1', apiRouter);


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
