'use strict';

/**
 * @ngdoc function
 * @name quantifyApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the quantifyApp
 */
angular.module('quantifyApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
