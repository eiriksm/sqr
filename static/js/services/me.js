var uuid = require('node-uuid');
var ls_var = 'sqr_id';

angular.module('sqr.services')
.service('me', ['$window', '$http', function($window, $http) {
  'use strict';
  var ls = $window.localStorage;
  return {
    getId: function(cb) {
      if (!ls) {
        cb(new Error('No localstorage, fool'));
        return;
      }
      var id = ls.getItem(ls_var);
      cb(null, id);
    },
    createId: function(cb) {
      if (!ls) {
        cb(new Error('No localstorage, fool'));
        return;
      }
      // Generate id.
      var id = uuid.v4();

      // Save id.
      ls.setItem(ls_var, id);
      cb(null, id);
    },
    getSqrs: function(id) {
      return $http({
        method: 'GET',
        url: '/api/data/' + id
      });
    },
    createSqr: function(id, name, data) {
      var sqr = {};
      data = data || {};
      sqr.data = data;
      sqr.id = id;
      sqr.name = name;
      return $http({
        method: 'POST',
        url: '/api/data/' + id,
        data: sqr
      });
    },
    deleteSqr: function(id) {
      return $http({
        method: 'DELETE',
        url: '/api/data/' + id + '?token=awesometoken'
      });
    },
    getSqrList: function() {
      return $http({
        method: 'GET',
        url: '/api/data'
      });
    }
  };
}]);
