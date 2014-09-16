var levelup = require('levelup');
var db = levelup('./leveldb');

exports.set = function(key, val, callback) {
  var _callback = callback || function() {};
  db.put(key, JSON.stringify(val), function (err) {
    _callback(err);
  });
};

exports.get = function(key, callback) {
  db.get(key, function (err, value) {
    if (err) {
      callback(err);
      return;
    }
    try {
      value = JSON.parse(value);
    }
    catch (e) {
      callback(e);
      return;
    }
    callback(err, value);
  });
};

exports.getRange = function(start, end, callback) {
  var data = [];
  var _callback = function(e, v) {
    if (callback) {
      callback(e, v);
    }
    callback = null;
  };
  var s = db.createReadStream({
    gte: start,
    lte: end
  });
  s.on('data', function(d) {
    data.push(d);
  });
  s.on('end', function() {
    _callback(null, data);
  });
  s.on('error', function(e) {
    _callback(e);
  });
};

exports.del = function(key, callback) {
  return db.del(key, callback);
};
