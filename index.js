var Hapi = require('hapi');

var db = require('./db');

var port = process.env.PORT || 9876;
var server = new Hapi.Server(port);

// Add the route
server.route({
  method: 'GET',
  path: '/api/data/{key}',
  handler: function (request, reply) {
    db.get(encodeURIComponent(request.params.key), function(e, v) {
      if (e && e.notFound) {
        reply('Not found').code(404);
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
      reply('cool');
    });
  }
});

// Start the server
server.start();
