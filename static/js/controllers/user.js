angular.module('sqr.controllers')
.controller('userCtrl', ['$scope', '$routeParams', 'me', function($scope, $routeParams, me) {
  'use strict';
  var id = $routeParams.id;
  // This feels a little badly named now...
  me.getSqrs(id)
  .success(function(d) {
    $scope.sqr = d;
    $scope.sqr.mood = d.data.mood || 'Normal';
  })
  .error(function(e, c) {
    // @todo. Error handling.
  });
}]);
