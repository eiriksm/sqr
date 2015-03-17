// Load angular and angular-route.
var angular = require('angular');
require('angular-route');

// Declare app.
angular.module('sqr', [
  'ngRoute',
  'sqr.controllers',
  'sqr.directives',
  'sqr.services'
  ])
.config(['$routeProvider', function($routeProvider) {
  // Specify routes to load our partials upon the given URLs
  $routeProvider.when('/index', {
    templateUrl: '/static/partials/index.html'
  });
  $routeProvider.when('/me', {
    templateUrl: '/static/partials/me.html'
  });
  $routeProvider.when('/user/:id', {
    templateUrl: '/static/partials/user.html'
  });
  $routeProvider.otherwise({redirectTo: '/index'});
}]);

// Create a controller module.
angular.module('sqr.controllers', []);

// Add controllers.
require('./controllers/index');
require('./controllers/me');
require('./controllers/user');

// Create a directive module
angular.module('sqr.directives', []);

// Add directives.
require('./directives/sqr');

// Create a services module.
angular.module('sqr.services', []);

// Require services.
require('./services/me');

// Require jQuery for bootstrap.
window.jQuery = require('jquery');
