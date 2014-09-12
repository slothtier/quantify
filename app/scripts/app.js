'use strict';

/**
 * @ngdoc overview
 * @name quantifyApp
 * @description
 * # quantifyApp
 *
 * Main module of the application.
 */
angular
  .module('quantifyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngRoute',
    'quantifyApp.controllers'
  ])
  .run(function($rootScope, $location) {
     //console.log($location.$$hash);
        if($location.$$hash.search(/([A-Za-z0-9_-]{155})/ig) > -1){
            $rootScope.location = $location.$$hash;
            $location.path('/main');
            $location.url($location.path());
            //console.log($rootScope.location);
            //console.log($location.$$hash);
            //console.log("authenticated!");
        }

  })
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/main', {
            templateUrl: '/views/main.html',
            controller: 'QuantifyCtrl'
            })
            .when('/auth', {
                templateUrl: '/views/auth.html',
                controller: 'AuthCtrl'
            })
            .otherwise({
                redirectTo: '/auth'
            });

        $locationProvider.html5Mode(true);
  }]);