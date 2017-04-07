/**
 * Scrumdog
 */


const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const config = require('./config.json');
const models = require('./models');

const apiRouter = require('./routes/apiv1');

const app = express();
app.use('/assets', express.static('client/build'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));


// only one route
app.get('/', (req, res) => {
  res.status(200).sendFile('client/build/index.html', {
    root: __dirname,
  });
});

// api routes
app.use('/api/v1', apiRouter);


/**
 * Start the Express server
 */
const startExpress = () => {
  app.listen(config.server.port, () => {
   console.log(`Scrumdog running on ${config.server.port}`);
  });
};

// you can pass --forcesync as the first argument to force a sync of the DB.
// todo - do this better, it's flaky.
models.sequelize.sync({
  force: process.argv[2] === '--forcesync',
}).then(startExpress);
