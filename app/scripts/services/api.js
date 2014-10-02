'use strict';

angular.module('quantifyApp.api', [])

    .factory('playlistService', function ($http, $q) {
        return {
            getPlaylist: function (apiUrl, authString) {
                return $http({method: 'GET', url: apiUrl, headers: {'Authorization': authString}})
                    .then(function (response) {
                        return response.data;
                    }, function (response) {
                        //api error
                        return $q.reject(response.data);
                    })
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
                    })
            }
        }
    })