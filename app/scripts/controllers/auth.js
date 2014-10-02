'use strict';

angular.module('quantifyApp.auth', [])

    .controller('AuthCtrl', function ($scope, authService) {
        $scope.authenticate = function () {
            window.location.href = authService.authenticate();
        }
    })
