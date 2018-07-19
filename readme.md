# Scrumdog Millionaire
Super-simple app for running a daily standup.


## Getting started

```
# clone the repo, then from root folder:
npm install
npm run build
cp config.json.example config.json
npm run start
```

By default it'll create an SQLITE db named scrumdog.sqlite, but it should be relatively easy to set up Sequelize to use another dialect (mySQL, Postgres, etc).


## User Auth

If you want to run Scrumdog on a public-facing server, you can enable user auth to prevent the APIs from being publicly visible.

In config.json, switch `authEnabled` to true and specify which OAuth services you'd like to use in `authServices`. You'll need to configure client apps for the services you want to enable; supported services are [Google](https://developers.google.com/identity/protocols/OAuth2) and [Github](https://developer.github.com/apps/building-oauth-apps/authorization-options-for-oauth-apps/), but it'd be trivial to support others via [Passport](http://www.passportjs.org/).


#### Notes on auth

The auth model is super simple at the moment; any authenticated user has total read/write access to everything. It's a trust-based system ;)

There's no registration; start the app with auth disabled and add users via user config. When auth is enabled, users are authenticated by matching against emails returned by the OAuth services; so to allow users to authenticate you'll need to use emails that are either registered with their Github account or their Google account.

Better access control might be a future feature... Open a pull request!
