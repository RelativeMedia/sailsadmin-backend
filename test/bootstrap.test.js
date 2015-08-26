var Sails = require('sails');
var Barrels = require('barrels');


// Global before hook
before(function (done) {
  // Lift Sails with test database
  Sails.lift({
    app: {
      intializeAdmin: true
    },
    jwt: {
      options: {
        secretKey: '12986124jn12kjg215o1222l21589912g598125b21m,5ng125iu12217ig57i12g5b125'
      }
    },
    log: {
      level: 'error'
    },
    connections: {
      'test': {
        adapter: 'sails-memory',
      }
    },
    models: {
      connection: 'test',
      migrate: 'drop'
    }
  }, function(err, sails) {
    if (err)
      return done(err);

    // Load fixtures
    var barrels = new Barrels();

    // Save original objects in `fixtures` variable
    fixtures = barrels.data;

    // Populate the DB
    barrels.populate(function(err) {
      done(err, sails);
    });
  });
});

// Global after hook
after(function (done) {
  console.log(); // Skip a line before displaying Sails lowering logs
  sails.lower(done);
});
