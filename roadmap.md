# Roadmap

## Features

* User management
  * Add, edit, delete users in a separate context to team/standup
* Reimplement Notes as a text field on Team

## Bugs, fixes, refactor

* Copy-paste summary is broken, doesn't update reactively
* Fix team edit UI, it's hideous
* Get everything linted
* Refactor from actions.js and reducers.js to using ducks
* Implement a uniform pattern for error handling (errors reducer and flash messages?)
* Implement a clean fetching/loading state pattern
* clean up the users reducer and state (think it's the last normalized reducer)


## Teams bugs, refactors

* Ensure lastDay entry loads from the same team only
* Deleting the last standup in a team throws an error (sometimes?)
