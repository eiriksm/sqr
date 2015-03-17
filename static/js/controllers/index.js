var $ = require('jquery');

angular.module('sqr.controllers')
.controller('indexCtrl', ['$scope', '$location', 'me', function($scope, $location, me) {
  'use strict';
  function init(id) {
    // Get all sqrs belonging to this person.
    me.getSqrs(id)
    .success(function(data) {
      if (data) {
        $scope.sqr = data;
        $scope.sqr.mood = data.data.mood;
      }
    })
    .error(function(error, code) {
      if (code === 404) {
        // No sqr found.
        $scope.sqr = false;
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


  // Get all sqr's.
  $scope.sqrs = [];
  me.getSqrList()
  .success(function(d) {
    for (var i = 0, len = d.length; i < len; i++) {
      var s;
      try {
        s = JSON.parse(d[i].value);
      }
      catch(err) {
        continue;
      }
      s.mood = s.data.mood || 'Normal';
      $scope.sqrs.push(s);
    }
  })
  .error(function(e, c) {

  });

  $scope.createSqr = function() {
    var name = $scope.name;
    me.createSqr($scope.id, name)
    .success(function(d) {
      init($scope.id);
      $('#createModal').modal('hide');
    })
    .error(function(e, c) {
      console.log(e, c);
    });
  };

  $scope.showCreateModal = function() {
    // Calling jQuery via angular. Feels awkward.
    $('#createModal').modal('show');
  };

  $scope.goToMe = function() {
    $location.path('/me');
  };
}]);
