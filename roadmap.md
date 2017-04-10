# Roadmap


## Features

* teams


## Bugs, fixes, refactor

* lint
* ducks pattern
* replace syncstate.failed with syncstate.error
* clean up the users reducer and state (think it's the last normalized reducer)


## Teams bugs, refactors

* Auto fetch last standup
* Add user to standup -> create user, add to team
  * or just deprecate this and have a users page somewhere
* Ensure lastDay entry loads from the same team only
* Deleting the last standup in a team throws an error (sometimes?)
