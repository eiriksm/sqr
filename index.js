var Hapi = require('hapi');

var port = process.env.PORT || 9876;
var server = new Hapi.Server('localhost', port);

// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {

        reply('hello world');
    }
});

// Start the server
server.start();
