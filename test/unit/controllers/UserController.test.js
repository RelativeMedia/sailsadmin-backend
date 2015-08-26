var request = require('supertest');
var faker = require('faker');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));
var token;

describe('Controllers::User', function(){

  describe('index()', function(){

    before(function(done){
      request(sails.hooks.http.app)
      .post('/v1/auth/login')
      .send({
        username: fixtures.user[0].username,
        password: fixtures.user[0].password
      })
      .expect('Content-Type', /json/)
      .end(function(err, res){
        var user = res.body.user;
        token = res.body.token;

        expect(err).to.be.null;
        expect(user).to.be.an('object');
        expect(res.body).to.have.property('token');

        done();
      });
    });

    it('should return 200 and should not have protected fields', function(done){

      request(sails.hooks.http.app)
      .get('/v1/user')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        expect(err).to.be.null;
        var user = res.body;
        expect(user).to.be.an('array');
        expect(user[0]).to.not.have.property('password');
        expect(user[0]).to.not.have.property('email');
        done();
      });
    });

  });

});
