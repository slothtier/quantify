'use strict';

/* Controllers */

angular.module('quantifyApp.controllers', [])
    .controller('QuantifyCtrl', ['$scope', function ($scope) {
    }])

    .controller('AuthCtrl', ['$scope', function ($scope) {
        $scope.authenticate = function () {
            //build authentication url => https://developer.spotify.com/web-api/authorization-guide/
            //TODO authentication should be a service
            var accountUrl = 'https://accounts.spotify.com/authorize';
            var clientID = 'client_id=2877dc4791af41e0b53de799f8cf2472';
            var redirectUri = 'redirect_uri=https%3A%2F%2Fslothtier.github.io%2Fquantify%2Findex.html';
            var authScope = 'scope=playlist-read-private';
            var responseType = 'response_type=token';
            var state = 'state=123';
            window.location.href = accountUrl + '?' + clientID + '&' + redirectUri + '&' + authScope + '&' + responseType + '&' + state;
        };

    }])

    .controller('MainCtrl', function ($scope, $http, $rootScope, parseUrl, playlistService, trackService, $q) {
        $scope.invalidUrl = 'enter a valid spotify playlist url or uri';

        $scope.quantify = function () {
            if (parseUrl.parse($scope.model.url).user === undefined) {
                //display error message
                $scope.invalidUrl = parseUrl.parse($scope.model.url);
                //clear input box
                $scope.model.url = '';
                //hide old playlist data
                $scope.showPlaylist = false;
                $scope.errorMessage = '';
            } else {
                //clear error messages
                $scope.invalidUrl = '';
                $scope.errorMessage = '';

                //prepare request for playlist data
                var userID = parseUrl.parse($scope.model.url).user;
                var playlistID = parseUrl.parse($scope.model.url).playlist;
                var apiUrl = 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID;

                //extract token from url
                var authString = 'Bearer ' + $rootScope.location.match(/([A-Za-z0-9_-]{155})/ig)[0];

                //get request for playlist data
                playlistService.getPlaylist(apiUrl, authString)
                    .then(function (data) {

                        //decompose api response
                        var completeResponse = data;
                        var trackResponse = completeResponse.tracks;

                        //extract playlist name, track count & track items
                        $scope.playlistName = completeResponse.name;
                        $scope.playlistTrackcount = trackResponse.total;
                        $scope.playlistItems = trackResponse.items;


                        $scope.tracksNew = [];

                        var apiUrlTracks = apiUrl + '/tracks';


                        //calculate total duration in ms


                        var apiUrlTracksNew = apiUrlTracks;
                        var x = 0;
                        var dataHelper = 0;
                        var dataHelper1 = 0;
                        var deferred = $q.defer();
                        var reqPromises = [];
                        var y = 0;


                        for (x; x < trackResponse.total;) {
                            //console.log('im in the loop: ' + x);
                            //console.log('calling : ' + apiUrlTracksNew);

                            trackService.getTracks(apiUrlTracksNew, authString)
                                .then(function (data) {
                                    //console.log('result of service: ' + data);
                                    dataHelper = data;
                                    dataHelper1 = dataHelper1 + dataHelper;
                                    reqPromises.push(dataHelper1);
                                    y = y + 1;


                                }, function (error) {
                                    console.log('error :', error.error.status);
                                })
                                .then(function () {
                                    var b = reqPromises.length;

                                    $scope.playlistDuration = reqPromises[b - 1];
                                    $scope.durationMin = reqPromises[b - 1] / 1000 / 60;

                                    //TODO size calculations should be a service
                                    //calculate idealized playlist sizes (12 20 40 KB/sec)
                                    $scope.sizeNormalQuality = Math.ceil($scope.durationMin * 60 * 12 / 1000);
                                    $scope.sizeHighQuality = Math.ceil($scope.durationMin * 60 * 20 / 1000);
                                    $scope.sizeExtremeQuality = Math.ceil($scope.durationMin * 60 * 40 / 1000);

                                    //calculate real playlist sizes (11,5 19,2 35,1 KB/sec)
                                    $scope.sizeNormalQualityReal = Math.ceil($scope.durationMin * 60 * 11.5 / 1000);
                                    $scope.sizeHighQualityReal = Math.ceil($scope.durationMin * 60 * 19.2 / 1000);
                                    $scope.sizeExtremeQualityReal = Math.ceil($scope.durationMin * 60 * 35.1 / 1000);
                                })
                                .then(function () {
                                    if (reqPromises.length = y) {
                                        $q.all(reqPromises).then(function () {


                                            deferred.resolve();
                                            //display playlist data
                                            $scope.showPlaylist = true;

                                        });
                                    }
                                });

                            x = x + 100;
                            apiUrlTracksNew = apiUrlTracks + '?offset=' + x;
                        }


                        return deferred.promise;


                    }, function (error) {
                        console.log('error :', error.error.status);
                        switch (error.error.status) {
                            case 401:
                                $scope.errorMessage = '~ your access token has expired, please <a href="#">re-authenticate</a> ~';
                                break;
                            case 404:
                                $scope.errorMessage = '~ playlist could not be found ~';
                                break;
                            case 429:
                                $scope.errorMessage = '~ too many requests, please try again later ~';
                                break;
                            case 503:
                                $scope.errorMessage = '~ Spotify appears to experience some problems currently ~';
                                break;
                            default:
                                $scope.errorMessage = '~ uh oh.. something went horribly wrong ~';
                        }
                        $scope.showPlaylist = false;

                    });
            }
        };
    });
