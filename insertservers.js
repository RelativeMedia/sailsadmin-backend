var Sails = require('sails');
var fs    = require('fs');
var _     = require('lodash');
var servers = JSON.parse(fs.readFileSync('sanitizedserverlist.json', 'utf8'));

console.log('Starting up...');
Sails.load({
  app: {
    initializeAdmin: true,
  },
  connections: {
    mysql: {
      adapter: 'sails-mysql',
      host: 'localhost',
      user: 'root',
      database: 'sapinfrastructure_dev'
    },
    mongodb: {
      adapter: 'sails-mongo',
      host: 'localhost',
      database: 'sapinfrastructure_dev'
    },
    disk: {
      adapter: 'sails-disk'
    }
  },
  views: {
    _hookTimeout: 60000
  },
  orm:{
    _hookTimeout: 60000
  },
  models: {
    connection: 'mysql',
    migrate: 'safe'
  },
  log: {
    level: 'debug'
  }
},
function(err, sails){
  if(err){
    console.error(err);
    process.exit();
  }else{
    sails.log.debug(servers.length, 'records to be inserted into the db');
    var count = 1;
    _.each(servers, function(server){
      Server.create(server).exec(function(err, server){
        if(err){
          console.error(err);
        }else{
          count++;
          sails.log.debug('Finished inserting record', count, 'of ', servers.length, 'total records');
        }
      });
    });
  }

});
