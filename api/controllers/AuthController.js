/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var AuthController = {

  login: function (req, res) {
    var username = req.param('username');
    var password = req.param('password');

    if (!username || !password) {
      return res.json(401, {type: 'error', msg: 'username and password required', category: 'AUTH_INVALID_LOGIN' });
    }

    User.findOneByUsername(username, function(err, user) {
      if (!user) {
        return res.json(401, {type: 'error', msg: 'invalid username or password', category: 'AUTH_INVALID_LOGIN'});
      }

      User.validatePassword(password, user.password, function(err, valid) {
        if (err) {
          sails.log.error(err);
          return res.json(403, {type: 'error', msg: 'forbidden'});
        }

        if (!valid) {
          return res.json(401, {type: 'error', msg: 'invalid username or password', category: 'AUTH_INVALID_LOGIN'});
        } else {

          var token = TokenAuth.issueToken( { uid: user.id, firstName: user.firstName, username: user.username, accessLevel: user.accessLevel, type: 'user' } );
          user.accessToken = token;
          user.save(function(){

            return res.json({
              user: user,
              token: token
            });

          });

        }
      });
    });
  },

  logout: function (req, res) {
    var token = req.token;
    User.update({ accessToken: token }, { accessToken: null }).exec(function(err, user){
      if (err) {
        sails.log.error(err);
        return res.json(403, {type: 'error', msg: 'forbidden', category: 'AUTH_INVALID_LOGIN'});
      }
      res.json(200);
    });
  },

  resetPassword: function(req, res){
    res.send(200);
  },

  register: function(req, res){
    //TODO: Do some validation on the input
    if (req.body.password !== req.body.confirmPassword) {
      return res.json(401, {type: 'error', msg: 'Password doesn\'t match', category: 'AUTH_INVALID_LOGIN'});
    }

    User.create({
      username: req.body.username,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    }).exec(function(err, user) {
      if (err) {
        res.json(err.status, {type: 'error', msg: err});
        return;
      }
      if (user) {
        var token = TokenAuth.issueToken( { uid: user.id, username: user.username, accessLevel: user.accessLevel, type: 'user' } );
        res.json({
          user: user,
          token: token
        });
      }
    });
  }
};

module.exports = AuthController;
