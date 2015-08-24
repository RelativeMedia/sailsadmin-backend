var _ = require('lodash');

module.exports = function(req, res, next) {
  var token;
  var headers;
  var params;

  function validate(token, cb){

    TokenAuth.verifyToken(token, function(err, token) {
      if (err) return res.json(401, {err: 'The token is not valid'});
      if(token.type === 'server'){
        return res.json(401, {err: 'The token is not valid'});
      }else{

        User.findOne(token.uid).exec(function(err, user){
          if(err) return res.send(500, {type: 'ERROR', msg: err});
          if(!user){
            sails.log.error({type: 'ERROR', msg: 'Not authorized to access this record.'});
            return res.send(401, {type: 'ERROR', msg: 'Not authorized to access this record.'} );
          }else{

            if(user.username === token.username){
              cb(token);
            }else{
              return res.send(401, {type: 'ERROR', msg: 'Not authorized to access this record.'} );
            }

          }
        });
      }
    });
  }

  if(req.isSocket){
    params = _.clone(req.body.params);
    delete req.body.params;
    sails.log.debug(params, req.body, req.params);

    validate(params.token, function(token){
      req.token = token;
      next();
    });
  }else{
    headers = req.headers;
    if (headers && headers.authorization) {
      var parts = headers.authorization.split(' ');
      if (parts.length == 2) {
        var scheme = parts[0],
          credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {
        return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
      }
    } else if (req.param('token')) {
      token = req.param('token');
      delete req.query.token;
    } else {
      return res.json(401, {err: 'No Authorization header was found'});
    }

    validate(token, function(token){
      req.token = token;
      next();
    });
  }
};
