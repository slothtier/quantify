'use strict';

/* Services */

angular.module('quantifyApp.api', [])
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

    .factory('playlistService', function ($http, $q) {
        return {
            getPlaylist: function (apiUrl, authString) {
                return $http({method: 'GET', url: apiUrl, headers: {'Authorization': authString}})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        //api error
                        return $q.reject(response.data);
                    });
            }
        }
    })

    .factory('trackService', function ($http, $q) {
        return {
            getTracks: function (apiUrl, authString) {
                return $http({method: 'GET', url: apiUrl, headers: {'Authorization': authString}})
                    .then(function (response) {
                        var dataHelper = response.data;
                        var tracksHelper = [];
                        var tracksListHelper = [];
                        var durationMsHelper = 0;

                        angular.forEach(dataHelper.items, function (item) {
                            tracksHelper.push(item);
                        });
                        for (var i = 0; i < Object.keys(tracksHelper).length; i++) {
                            tracksListHelper.push(tracksHelper[i].track);
                        }
                        for (var j = 0; j < Object.keys(tracksListHelper).length; j++) {
                            durationMsHelper = durationMsHelper + tracksListHelper[j].duration_ms;
                        }
                        return durationMsHelper;
                    }, function (response) {
                        //api error
                        return $q.reject(response.data);
                    });
            }
        };
    });