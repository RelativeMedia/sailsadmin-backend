var request = require('supertest');
var faker = require('faker');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));


describe('Controllers::Auth', function(){

  describe('register()', function(){
    it('should register a user and have a valid token', function(done){
      var password = faker.internet.password();
      var token;
      var newUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: password,
        confirmPassword: password,
      };

      request(sails.hooks.http.app)
      .post('/v1/auth/register')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        var user = res.body.user;
        token = res.body.token;
        var decodedToken = TokenAuth.verifyToken(token);

        expect(err).to.be.null;

        expect(token).to.be.a('string');
        expect(decodedToken).to.have.property('uid');
        expect(decodedToken).to.have.property('username');
        expect(decodedToken).to.have.property('accessLevel');
        expect(decodedToken).to.have.property('type');
        expect(decodedToken).to.have.property('iat');

        expect(user).to.have.property('firstName', newUser.firstName);
        expect(user).to.have.property('username', newUser.username);
        expect(user).to.not.have.any.keys('email', 'password', 'token', 'lastName', 'accessLevel');

        done();
      });

    });

  });

  describe('login()', function(){
    var password = faker.internet.password();
    var token;
    var newUser = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: password,
      confirmPassword: password,
    };

    before(function(done){
      request(sails.hooks.http.app)
      .post('/v1/auth/register')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        var user = res.body.user;
        token = res.body.token;
        expect(err).to.be.null;
        done();
      });
    });

    it('should return 200, and a user object', function(done){
      request(sails.hooks.http.app)
      .post('/v1/auth/login')
      .send({
        username: newUser.username,
        password: newUser.password
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        var user = res.body.user;
        token = res.body.token;

        expect(err).to.be.null;
        expect(user).to.have.property('firstName', newUser.firstName);
        expect(user).to.have.property('username', newUser.username);
        expect(user).to.not.have.any.keys('email', 'password', 'token', 'lastName', 'accessLevel');
        done();
      });

    });

    it('the user token should be valid', function(done){
      request(sails.hooks.http.app)
      .post('/v1/auth/login')
      .send({
        username: newUser.username,
        password: newUser.password
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        var user = res.body.user;
        token = res.body.token;
        var decodedToken = TokenAuth.verifyToken(token);

        expect(err).to.be.null;
        expect(token).to.be.a('string');
        expect(decodedToken).to.have.property('uid');
        expect(decodedToken).to.have.property('username');
        expect(decodedToken).to.have.property('accessLevel');
        expect(decodedToken).to.have.property('type');
        expect(decodedToken).to.have.property('iat');
        done();
      });

    });
  });


});
