var $ = require('jquery');

angular.module('sqr.controllers')
.controller('meCtrl', ['$scope', '$location', 'me', function($scope, $location, me) {
  'use strict';
  function init(id) {
    // Get all sqrs belonging to this person.
    me.getSqrs(id)
    .success(function(data) {
      if (data) {
        $scope.sqr = data;
        $scope.sqr.mood = data.data.mood || 'Normal';
      }
    })
    .error(function(error, code) {
      if (code === 404) {
        // No sqr found.
        $location.path('/');
      }
    });
  }

  // See if user has id.
  me.getId(function(err, id) {
    if (err) {
      $scope.error = true;
      return;
    }
    if (!id) {
      // No id. Generate one.
      me.createId(function(e, i) {
        $scope.id = i;
      });
      return;
    }
    $scope.id = id;
    init(id);
  });

  $scope.saveSqr = function() {
    var name = $scope.sqr.name;
    var data = {
      mood: $scope.sqr.mood
    };
    me.createSqr($scope.id, name, data)
    .success(function(d) {
      init($scope.id);
    })
    .error(function(e, c) {
      console.log(e, c);
    });
  };

  $scope.deleteSqr = function() {
    me.deleteSqr($scope.id)
    .success(function() {
      init($scope.id);
      $('#deleteModal').modal('hide');
    })
    .error(function(e, c) {
      console.error('Had an error');
      console.log(e, c);
    });
  };

  $scope.showDeleteModal = function() {
    $('#deleteModal').modal('show');
  };
}]);
