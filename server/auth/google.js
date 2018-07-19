/**
 * server/auth/google
 * handle authentication via google oauth 2.0
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Sequelize = require('sequelize');

const log = require('../lib/logger');
const db = require('../models');
const config = require('../../config.json');

const REQUIRED_CONFIG = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL'];


// validate that we can use the service
const validateConfig = () => {
  REQUIRED_CONFIG.forEach((key) => {
    if (!config[key]) {
      throw new Error(`${REQUIRED_CONFIG} is required to configure Google auth`);
    }
  });
  return true;
};

// hook the service into the app
const init = (app) => {
  validateConfig();

  // configure the passport strategy
  passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
  }, (accessToken, refreshToken, googleProfile, callback) => Promise.resolve()
    // google profile will return an array of emails
    // so look for a user whose email matches any of them.
    .then(() => {
      const emails = googleProfile.emails.map(email => email.value);
      return db.User.findOne({
        where: {
          email: {
            [Sequelize.Op.in]: emails,
          },
        },
      });
    })
    .then(user => callback(null, user))
    .catch(callback)
  ));

  // add the route for signing in via Google
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['email'], // need the email
  }));

  // callback route that Google will redirect to after a successful login
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/')
  );

  log.info('Google auth service initialised');
  return true;
};

module.exports = {
  validateConfig,
  init,
};
