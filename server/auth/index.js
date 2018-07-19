/**
 * server/auth
 * handles authentication services
 */

const passport = require('passport');


const config = require('../../config.json');
const db = require('../models');
const log = require('../lib/logger');

const googleService = require('./google');
const githubService = require('./github');

const VALID_AUTH_SERVICES = ['google', 'github'];
const SERVICES_MAP = {
  google: googleService,
  github: githubService,
};

/**
 * Returns an array of valid auth services as specified
 * by config.authServices
 * @return {String[]}
 */
const getEnabledServices = () => {
  if (!config.authServices) {
    return [];
  }

  if (!Array.isArray(config.authServices)) {
    throw new Error('config.authServices must be null or an array of auth service names');
  }

  const enabledValidServices = config.authServices.filter(service =>
    VALID_AUTH_SERVICES.includes(service)
  );
  return enabledValidServices;
};


// serialize the user object to save in the session store.
// ie, return the ID.
passport.serializeUser((userObject, done) => {
  done(null, userObject.id);
});

// deserialize from the session store to put on req.user
// ie, get the user from their ID.
passport.deserializeUser((id, done) => {
  db.User.findOne({
    where: {
      id,
    },
  }).then(user => done(null, user))
  .catch(done);
});


// Initialize our Express app with the above
module.exports = {
  getEnabledServices,
  init: (app) => {
    app.get('/logout', (req, res) => {
      req.session.destroy();
      res.redirect('/');
    });

    const enabledServices = getEnabledServices();
    if (!enabledServices.length) {
      log.info('There are no auth services enabled, app is in guest mode');
      return false;
    }

    app.use(passport.initialize());
    app.use(passport.session());

    enabledServices.forEach((serviceName) => {
      SERVICES_MAP[serviceName].init(app);
    });

    log.info('Completed initialising auth services');
    return true;
  },
};
