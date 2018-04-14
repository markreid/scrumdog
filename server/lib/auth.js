/**
 * lib/auth
 * handles authentication
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const Octokit = require('@octokit/rest');

const config = require('../../config.json');
const db = require('../models');
const Op = db.Sequelize.Op;


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



passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, googleProfile, callback) => {
  // google profile will return an array of emails
  // so look for a user whose email matches any of them.
  return Promise.resolve()
    .then(() => {
      const emails = googleProfile.emails.map(email => email.value);
      return db.User.findOne({
        where: {
          email: {
            [Op.in]: emails,
          },
        },
      });
    })
    .then(user => callback(null, user))
    .catch(callback);
}));


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
          [Op.in]: emails,
        },
      },
    });
  })
  .then(user => callback(null, user))
  .catch(err => {
    console.log(err);
    callback(err)
  });
}));

// Initialize our Express app with the above
module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());


  // add the route for signing in via Google
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['email'], // need the email
  }));

  // callback route that Google will redirect to after a successful login
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function successfulGoogleAuthCallback(req, res) {
      // the user's now successfully authenticated.
      // their user object is now available on each subsequent request:
      console.log(req.session.passport.user);
      res.redirect('/');
    }
  );

  app.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email'] // get the email
  }));

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function successfulGithubCallback(req, res) {
      console.log('authenticated with github');
      res.redirect('/');
    }
  );

  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
}
