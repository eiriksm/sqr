var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var should = require('should');
var request = require('supertest');

var server = require('..');
var req = request(server.listener);
var db = require('../db');

describe('App routes', function() {
  it('Should reply as expected on an unknown key', function(done) {
    var random = 'testkey' + Math.random();
    req
    .get('/api/data/' + random)
    .end(function(r, res) {
      res.statusCode.should.equal(404);
      done();
    });
  });
  it('Should give back the expected value on a known key', function(done) {
    var key = 'testkey' + Math.random();
    db.set(key, {key: key}, function() {
      req
      .get('/api/data/' + key)
      .end(function(r, res) {
        res.statusCode.should.equal(200);
        res.text.should.equal('{"key":"' + key + '"}');
        db.del(key, function(e) {
          done(e);
        });
      });
    });
  });
  it('Should save a value on POSTing, and give it back on GET', function(done) {
    var key = 'testkey' + Math.random();
    req
    .post('/api/data/' + key)
    .send({key: key})
    .end(function(r, res) {
      res.statusCode.should.equal(201);
      req
      .get('/api/data/' + key)
      .end(function(r, res) {
        res.text.should.equal('{"key":"' + key + '"}');
        done();
      });
    });
  });
});
