## 2016-12-09

- Added unit testing for the server api endpoints
- The server now returns a new list on POST and DELETE and request (except when deleting all todos). 
The client handles the returned lists to update the UI.
- Removed unused `todo` and `user` states.
- Introduces modules for `todoUsers` and `userTodos` states, and resolving required data before entering
the states.
- Added a FAB (Floating Action) button to add a todo or user.

## 2016-12-07

### Initial version