# Roadmap

## Features

* Move Notes to Team

## Bugs, fixes, refactor

* Fix team edit UI
* Get everything linted
* Refactor from actions.js and reducers.js to using ducks
* Implement a uniform pattern for error handling (errors reducer and flash messages?)
* Implement a clean fetching/loading state pattern
* clean up the users reducer and state (think it's the last normalized reducer)


## Teams bugs, refactors

* Add user to standup -> create user, add to team
  * or just deprecate this and have a users page somewhere
* Ensure lastDay entry loads from the same team only
* Deleting the last standup in a team throws an error (sometimes?)
