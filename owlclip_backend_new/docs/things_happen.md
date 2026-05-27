-In nodejs the db query and then return the response.

- but in sqlalchemy have to create a session 

The Trap: If you try to access user.profile after the session is closed, Python will throw an error: Instance <User> is not bound to a Session. 

The Fix: If you need to use the data after the session is gone, use .expunge(object) or ensure you've loaded everything you need while the with block was still open.

