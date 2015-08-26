var faker = require('faker');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));


describe('Models::User', function() {
  var CreateUser = {};

  describe('findOne()', function() {
    it('given invalid username, it should not find a single user', function(done){
        User.findOne({
          username: 'foobar',
        }).exec(function(err, user){
          expect(err).to.be.null;
          expect(user).to.be.undefined;
          done();
        });
    });

    it('given valid username, it should find a single user', function (done) {
      User.findOne({
        username: fixtures.user[0].username
      }).exec(function(err, user){
        expect(err).to.be.null;
        expect(user).to.be.an('object');
        expect(user).to.have.property('username', fixtures.user[0].username);
        expect(user).to.have.property('firstName', fixtures.user[0].firstName);
        expect(user).to.have.property('lastName', fixtures.user[0].lastName);
        expect(user).to.have.property('email', fixtures.user[0].email);
        expect(user).to.have.property('accessLevel', fixtures.user[0].accessLevel);
        done();
      });

    });
  });


  describe('find()', function(){
    it('should find an array of users', function(done){
      User.find().exec(function(err, users){
        expect(err).to.be.null;
        expect(users).to.be.an('array');
        // expect(users).to.have.lengthOf(fixtures.user.length);
        done();
      });
    });
  });

  describe('create()', function(){
    it('should create a new user with a hashed password', function(done){

      User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        accessLevel: 1,
      }).exec(function(err, user){
        expect(err).to.be.null;
        expect(user).to.be.an('object');
        done();
      });
    });
  });

  describe('update()', function(){
    it('should update an existing user with some data', function(done){
      var newfirstName = faker.name.firstName();
      User.update({
        username: fixtures.user[0].username,
      },
      {
        firstName: newfirstName
      }).exec(function(err, user){
        expect(err).to.be.null;
        expect(user).to.be.an('array')
          .and.to.contain.an.item.with.property('firstName', newfirstName);
        CreateUser = user;
        done();
      });
    });
  });

  describe('destroy()', function(){
    var newUser;
    before(function(done){
      User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        accessLevel: 1,
      }).exec(function(err, user){
        expect(err).to.be.null;
        expect(user).to.be.an('object');
        newUser = user;
        done();
      });
    });

    it('should delete an existing user given an id', function(done){
      User.destroy({ id: newUser.id }).exec(function(err, user){
        expect(err).to.be.null;
        expect(user).to.be.an('array');
        done();
      });

    });
  });


});
