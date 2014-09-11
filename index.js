var Hapi = require('hapi');

var db = require('./db');

var port = process.env.PORT || 9876;
var server = new Hapi.Server(port);

// Add the routes
server.route({
  method: 'GET',
  path: '/',
  handler: {
    file: {
      path: './static/index.html'
    }
  }
});
server.route({
  method: 'GET',
  path: '/static/{path*}',
  handler: {
    directory: {
      path: './static',
      index: true
    }
  }
});
server.route({
  method: 'GET',
  path: '/api/data/{key}',
  handler: function (request, reply) {
    db.get(encodeURIComponent(request.params.key), function(e, v) {
      if (e && e.notFound) {
        reply().code(404);
        return;
      }
      reply(v);
    });
  }
});
server.route({
  method: 'POST',
  path: '/api/data/{key}',
  handler: function (request, reply) {
    db.set(encodeURIComponent(request.params.key), request.payload, function(e) {
      if (e) {
        reply(e);
        return;
      }
      reply('').code(201);
    });
  }
});

// Start the server
server.start();
module.exports = server;
