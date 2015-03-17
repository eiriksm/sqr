angular.module('sqr.directives')
.directive('sqr', function() {
  'use strict';
  return {
    restrict: 'E',
    scope: {
      sqr: '='
    },
    templateUrl: '/static/partials/sqr.html',
    link: function(scope) {
      scope.getEyeHeight = function(side) {
        if (scope.sqr && scope.sqr.mood === 'Angry') {
          return 4;
        }
        return 8;
      };
      scope.getMouth = function() {
        if (scope.sqr && scope.sqr.mood === 'Angry') {
          return 'M80 80 C 80 30, 20 30, 20 80 Z';
        }
        if (scope.sqr && scope.sqr.mood === 'Happy') {
          return 'M80 60 C 80 100, 20 100, 20 60 Z';
        }
        return 'M80 80 C 80 80, 20 80, 20 80';
      };
      scope.getMouthFill = function() {
        if (scope.sqr && scope.sqr.mood === 'Angry') {
          return '#000';
        }
        if (scope.sqr && scope.sqr.mood === 'Happy') {
          return '#000';
        }
        return 'transparent';
      };
      scope.getSqrColor = function() {
        return 'yellow';
      };
      scope.getEyeColor = function() {
        return 'blue';
      };
    }
  };
});
