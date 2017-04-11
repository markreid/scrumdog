# Scrumdog Millionaire
Super-simple app for running a daily standup.


## Getting started

```
# clone the repo, then from root folder:
npm install
npm run build
cp db.json.example db.json
npm run start
```

By default it'll create an SQLITE db named scrumdog.sqlite, but it should be relatively easy to set up Sequelize to use another dialect (mySQL, Postgres, etc).
