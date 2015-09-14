var Hapi = require('hapi');
var t = require('joi');
var Inert = require('inert');
var db = require('./db');

var port = process.env.PORT || 9876;
var server = new Hapi.Server();
server.connection({ port: port });
server.register([require('vision'), require('inert'), { register: require('lout') }], function(err) {
});
// Add the routes
server.route({
  method: 'GET',
  path: '/',
  config: {
    handler: {
      file: {
        path: './static/index.html'
      }
    },
    plugins: {
      lout: false
    }
  }
});
server.route({
  method: 'GET',
  path: '/static/{path*}',
  config: {
    handler: {
      directory: {
        path: './static',
        index: true
      }
    },
    plugins: {
      lout: false
    }
  }
});
server.route({
  method: 'GET',
  path: '/api/data',
  config: {
    description: 'Get a list of all sqr belonging to a user',
    handler: function (request, reply) {
      db.getRange(server.nameSpace + ':sqr', server.nameSpace + ':sqr:' + '\xff', function(e, v) {
        reply(v);
      });
    }
  }
});
server.route({
  method: 'GET',
  path: '/api/data/{key}',
  handler: function (request, reply) {
    db.get(server.nameSpace + ':sqr:' + encodeURIComponent(request.params.key), function(e, v) {
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
  config: {
    description: 'Create a sqr',
    validate: {
      payload: {
        id: t.string().min(1).insensitive().required(),
        name: t.string().min(1).insensitive().required(),
        data: t.object()
      }
    }
  },
  handler: function (request, reply) {
    db.set(server.nameSpace + ':sqr:' + encodeURIComponent(request.params.key), request.payload, function(e) {
      if (e) {
        reply(e);
        return;
      }
      reply('').code(201);
    });
  }
});
server.route({
  method: 'DELETE',
  path: '/api/data/{key}',
  config: {
    description: 'Delete a sqr',
    validate: {
      query: {
        token: t.string().required()
      }
    }
  },
  handler: function (request, reply) {
    db.del(server.nameSpace + ':sqr:' + encodeURIComponent(request.params.key), function(e) {
      if (e) {
        reply(e);
        return;
      }
      reply('').code(200);
    });
  }
});

// Start the server
server.start(function() {
  console.log('Server started at %d', port); 
});
server.nameSpace = 'sqr';
module.exports = server;
