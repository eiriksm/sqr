var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var should = require('should');

var server = require('..');
var db = require('../db');

describe('App routes', function() {
  it('Should reply as expected on an unknown key', function(done) {
    var random = 'testkey' + Math.random();
    server.inject({
      method: 'GET',
      url: '/api/data/' + random
    }, function(res) {
      res.statusCode.should.equal(404);
      done();
    });
  });
  it('Should give back the expected value on a known key', function(done) {
    var key = 'testkey' + Math.random();
    db.set(key, {key: key}, function() {
      server.inject({
        method: 'GET',
        url: '/api/data/' + key
      }, function(res) {
        res.statusCode.should.equal(200);
        res.payload.should.equal('{"key":"' + key + '"}');
        // Make sure we clean up as well.
        db.del(key, function(e) {
          done(e);
        });
      });
    });
  });
  it('Should save a value on POSTing, and give it back on GET', function(done) {
    var key = 'testkey' + Math.random();
    server.inject({
      method: 'POST',
      url: '/api/data/' + key,
      payload: JSON.stringify({key: key})
    }, function(res) {
      res.statusCode.should.equal(201);
      server.inject({
        method: 'GET',
        url: '/api/data/' + key
      }, function(r) {
        r.payload.should.equal('{"key":"' + key + '"}');
        done();
      });
    });
  });
});
