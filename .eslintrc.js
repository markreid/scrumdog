module.exports = {
  "env": {
    "browser": true,
    "node": true,
  },
  "extends": "airbnb",
  "plugins": [
    "react"
  ],
  "parser": "babel-eslint", // support for decorators etc
  "rules": {
    "import/no-extraneous-dependencies": [0, {
      "devDependencies": ["client/src/**/*"]
    }],
    "no-console": 0,
  }
};
