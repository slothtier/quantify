'use strict';

angular.module('quantifyApp.auth', [])

    .factory('authService', function () {
        var buildUrl = function () {
            //build authentication url => https://developer.spotify.com/web-api/authorization-guide/
            var accountUrl = 'https://accounts.spotify.com/authorize';
            var clientID = 'client_id=2877dc4791af41e0b53de799f8cf2472';
            var redirectUri = 'redirect_uri=https%3A%2F%2Fslothtier.github.io%2Fquantify%2Findex.html';
            var authScope = 'scope=playlist-read-private';
            var responseType = 'response_type=token';
            var state = 'state=123';
            return accountUrl + '?' + clientID + '&' + redirectUri + '&' + authScope + '&' + responseType + '&' + state;
        }
        return {
            authenticate: function () {
                return buildUrl();
            }
        }
    })