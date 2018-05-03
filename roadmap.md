# Roadmap

## Features

* Access control
* Reimplement Notes as a text field on Team

## Bugs, fixes, refactor

* Polish the auth UI
* A lot of interactive UI elements aren't obvious to users
* Implement a uniform pattern for error handling (errors reducer and flash messages?)
  * Currently no connectivity error handling in the UI
* Saving a user doesn't update their details in an active standup (doens't propagate to Team Users maybe?)
* Get everything linted
* Refactor from actions.js and reducers.js to using ducks
* Implement a clean fetching/loading state pattern
* clean up the users reducer and state (think it's the last normalized reducer)



## UI cleanup

- Add an icon so the menu is obvious
- Teams and Users should be proper views, accessible via menu
- Hide the previous standups away somewhere, you don't need to access them all the time
-
- Team name in the menu should have a "change" icon, which opens a little switcher
