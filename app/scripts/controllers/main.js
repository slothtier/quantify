'use strict';

angular.module('quantifyApp.main', [])

    .controller('MainCtrl', function ($scope, $http, $rootScope, url, playlistService, trackService, $q, size) {

        $scope.quantify = function () {
            if (url.validate($scope.url) === false) {
                //clear input box
                $scope.url = '';
                //hide old playlist data
                $scope.showPlaylist = false;
                $scope.errorMessage = '';
            } else {
                //clear error message
                $scope.errorMessage = '';

                //prepare request for playlist data
                var userID = url.validate($scope.url).user;
                var playlistID = url.validate($scope.url).playlist;
                var apiUrl = 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID;

                //extract token from url
                var authString = 'Bearer ' + $rootScope.location.match(/([A-Za-z0-9_-]{155})/ig)[0];

                //get request for playlist data
                playlistService.getPlaylist(apiUrl, authString)
                    .then(function (data) {

                        //decompose api response
                        var completeResponse = data;
                        var trackResponse = completeResponse.tracks;

                        //extract playlist name & track count
                        $scope.playlistName = completeResponse.name;
                        $scope.playlistTrackcount = trackResponse.total;

                        $scope.tracksNew = [];

                        var apiUrlTracks = apiUrl + '/tracks';


                        //calculate total duration in ms


                        var apiUrlTracksNew = apiUrlTracks;
                        var x = 0;
                        var dataHelper = 0;
                        var deferred = $q.defer();
                        var reqPromises = [];
                        var y = 0;


                        for (x; x < trackResponse.total;) {
                            //console.log('im in the loop: ' + x);
                            //console.log('calling : ' + apiUrlTracksNew);

                            trackService.getTracks(apiUrlTracksNew, authString)
                                .then(function (data) {
                                    //console.log('result of service: ' + data);
                                    dataHelper += data;
                                    reqPromises.push(dataHelper);
                                    y += 1;


                                }, function (error) {
                                    $scope.errorMessage = error.error.status;
                                })
                                .then(function () {
                                    var b = reqPromises.length;

                                    $scope.playlistDuration = reqPromises[b - 1];

                                    var durationSec = reqPromises[b - 1] / 1000;
                                    $scope.sizeNormalQuality = size.calculate(durationSec, 'normal');
                                    $scope.sizeHighQuality = size.calculate(durationSec, 'high');
                                    $scope.sizeExtremeQuality = size.calculate(durationSec, 'extreme');

                                    $scope.sizeNormalQualityReal = size.calculate(durationSec, 'normal_real');
                                    $scope.sizeHighQualityReal = size.calculate(durationSec, 'high_real');
                                    $scope.sizeExtremeQualityReal = size.calculate(durationSec, 'extreme_real');
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
                        $scope.errorMessage = error.error.status;
                        $scope.showPlaylist = false;
                    });
            }
        };
    });
