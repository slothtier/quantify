'use strict';

angular.module('quantifyApp.main', [])

    .controller('MainCtrl', function ($scope, $http, $rootScope, url, playlistService, trackService, $q, size) {

        $scope.quantify = function () {
            if (url.validate($scope.url) === false) {
                //clear input box & hide old playlist data
                $scope.url = '';
                $scope.showPlaylist = false;
                $scope.errorMessage = '';
                $scope.tmpUrl = $scope.url;
            } else {
                //only request playlist data if url has changed
                if ($scope.url != $scope.tmpUrl) {

                    $scope.tmpUrl = $scope.url;

                    //clear error message
                    $scope.errorMessage = '';

                    //prepare request for playlist data
                    var userID = url.validate($scope.url).user;
                    var playlistID = url.validate($scope.url).playlist;
                    var apiUrl = 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID;

                    //extract token from url
                    var authString = 'Bearer ' + $rootScope.location.match(/([A-Za-z0-9_-]{155,})/ig)[0];

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

                            var apiUrlTracksNew = apiUrlTracks;
                            var x = 0;
                            var dataHelper = 0;
                            var deferred = $q.defer();
                            var reqPromises = [];
                            var y = 0;

                            for (x; x < trackResponse.total;) {

                                trackService.getTracks(apiUrlTracksNew, authString)
                                    .then(function (data) {
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
                                        $scope.sizeNormalQualityIdeal = size.calculate(durationSec, 'normal');
                                        $scope.sizeHighQualityIdeal = size.calculate(durationSec, 'high');
                                        $scope.sizeExtremeQualityIdeal = size.calculate(durationSec, 'extreme');

                                        $scope.sizeNormalQualityReal = size.calculate(durationSec, 'normal_real');
                                        $scope.sizeHighQualityReal = size.calculate(durationSec, 'high_real');
                                        $scope.sizeExtremeQualityReal = size.calculate(durationSec, 'extreme_real');

                                        $scope.toggle = true;
                                        $scope.toggleBitrate();
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

                                x += 100;
                                apiUrlTracksNew = apiUrlTracks + '?offset=' + x;
                            }


                            return deferred.promise;


                        }, function (error) {
                            $scope.errorMessage = error.error.status;
                            $scope.showPlaylist = false;
                        });
                }
            }
        }


        $scope.toggleBitrate = function () {

            if ($scope.toggle === false) {
                $scope.sizeNormalQuality = $scope.sizeNormalQualityReal;
                $scope.sizeHighQuality = $scope.sizeHighQualityReal;
                $scope.sizeExtremeQuality = $scope.sizeExtremeQualityReal;

                $scope.bitrateType = "realistic";
                $scope.bitrateNormal = "92";
                $scope.bitrateHigh = "153";
                $scope.bitrateExtreme = "281";

                $scope.toggle = true;
            } else {
                $scope.sizeNormalQuality = $scope.sizeNormalQualityIdeal;
                $scope.sizeHighQuality = $scope.sizeHighQualityIdeal;
                $scope.sizeExtremeQuality = $scope.sizeExtremeQualityIdeal;

                $scope.bitrateType = "idealized";
                $scope.bitrateNormal = "96";
                $scope.bitrateHigh = "160";
                $scope.bitrateExtreme = "320";

                $scope.toggle = false;
            }
        }
    })
