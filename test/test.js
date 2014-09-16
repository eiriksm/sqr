var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var should = require('should');
var request = require('supertest');

var server = require('..');
server.nameSpace = 'test';
var req = request(server.listener);
var db = require('../db');
var key = 'testkey' + Math.random();

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
    db.set(server.nameSpace + ':sqr:' + key, {key: key}, function() {
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
  it('Should return a range on /api/data', function(done) {
    req
    .get('/api/data')
    .end(function(r, res) {
      res.statusCode.should.equal(200);
      // Should have a length.
      var all = JSON.parse(res.text);
      // See if the latest key is in there.
      var isthere = false;
      all.forEach(function(n) {
        if (n.key === server.nameSpace + ':sqr:' + key) {
          isthere = true;
        }
      });
      isthere.should.equal(true);
      db.del(key, function(e) {
        done(e);
      });
    });
  });
});
