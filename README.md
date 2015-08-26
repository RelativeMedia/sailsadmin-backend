# sailsadmin-backend
a sailsJs powered backend for the sailsadmin-frontend. Uses JWT for token based authentication. It has two blueprint overrides, one for find which returns pagination metadata on each `find()` request. It also has a count blueprint to return just the count of a given model.

For the custom `count()` blueprint you will need to add a route for each Model you want to expose this to. For example, to expose `/v1/user/count` you'd write a route  in `config/routes.js`like so:

```javascript
'GET /v1/user/count': {
  blueprint: 'count',
  model: 'User'
},
```

## Testing
there are tests built into the backend that do unit testing of the routes, controllers, and models. 
