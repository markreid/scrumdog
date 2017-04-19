# Roadmap

## Features

* Reimplement Notes as a text field on Team

## Bugs, fixes, refactor

* Implement a uniform pattern for error handling (errors reducer and flash messages?)
  * Currently no connectivity error handling in the UI
* Saving a user doesn't update their details in an active standup (doens't propagate to Team Users maybe?)
* Get everything linted
* Refactor from actions.js and reducers.js to using ducks
* Implement a clean fetching/loading state pattern
* clean up the users reducer and state (think it's the last normalized reducer)
