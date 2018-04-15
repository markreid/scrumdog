/**
 * server/auth/github
 * handle authentication via github oauth 2.0
 */


const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const Octokit = require('@octokit/rest');
const Sequelize = require('sequelize');

const db = require('../models');
const log = require('../lib/logger');
const config = require('../../config.json');

const REQUIRED_CONFIG = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'GITHUB_CALLBACK_URL'];


// validate that we can use the service
const validateConfig = () => {
  REQUIRED_CONFIG.forEach((key) => {
    if (!config[key]) {
      throw new Error(`${REQUIRED_CONFIG} is required to configure Github auth`);
    }
  });
  return true;
};

// hook the service into the app
const init = (app) => {
  validateConfig();

  // configure the passport strategy
  passport.use(new GithubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_CALLBACK_URL,
  }, (accessToken, refreshToken, profile, callback) => {
    // github oauth won't return emails unless they're public
    // so we need to actually make an API call here to fetch them.
    const octokit = new Octokit();
    octokit.authenticate({
      type: 'oauth',
      token: accessToken,
    });
    octokit.users.getEmails()
    .then((response) => {
      const emails = response.data.map(data => data.email);
      return db.User.findOne({
        where: {
          email: {
            [Sequelize.Op.in]: emails,
          },
        },
      });
    })
    .then(user => callback(null, user))
    .catch((error) => {
      log.error(error);
      callback(error);
    });
  }));

  app.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email'], // get the email
  }));

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/')
  );

  log.info('Github auth service initialised');
};


module.exports = {
  validateConfig,
  init,
};
