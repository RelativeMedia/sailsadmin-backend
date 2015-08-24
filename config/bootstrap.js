/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  sails.hooks.http.app.set('trust proxy', true);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  var newUser = {
    username: 'admin',
    firstName: 'Super',
    lastName: 'User',
    email: 'admin@admin.com',
    password: 'admin1234',
    accessLevel: 2
  };

  if(sails.config.app.initializeAdmin === true){

    User.findOrCreate({
      username: 'admin',
    }, newUser).exec(function(err, user){
      if(err){
        sails.log.error(err);
        return cb(err);
      }


      sails.log.debug('Default Admin Account Information');
      sails.log.debug('    username:', user.username);
      sails.log.debug('    password:', newUser.password);
      cb();
      // if(users.length < 1){
      //   sails.log.info('Admin user isn\'t created for some reason, creating it');
      //   return cb({ msg: 'Admin User not Created'});
      // }else{
      //   cb();
      // }
    });
  }else{
    cb();
  }

};
