'use strict';

angular
  .module('quantifyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngRoute',
    'quantifyApp.main',
    'quantifyApp.auth',
    'quantifyApp.api',
    'quantifyApp.authentication',
    'quantifyApp.validation',
    'quantifyApp.calculation',
    'quantifyApp.scrolling',
    'quantifyApp.displayduration',
    'quantifyApp.errorhandling',
    'quantifyApp.formatfilesize'
  ])
    .run(function ($rootScope, $location) {
        //if access token is in query string, grab & delete it from url
        if ($location.$$hash.search(/([A-Za-z0-9_-]{155,})/ig) > -1) {
            $rootScope.accessToken = $location.$$hash.match(/([A-Za-z0-9_-]{155,})/ig)[0];
            $location.path('/main');
            $location.url($location.path())
        }

    })
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/auth', {
                templateUrl: 'views/auth.html',
                controller: 'AuthCtrl'
            })
            .otherwise({
                redirectTo: '/auth'
            });

        $locationProvider.html5Mode(true);
    }]);