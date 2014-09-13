'use strict';

/* Controllers */

angular.module('quantifyApp.controllers', [])
     .controller('QuantifyCtrl', ['$scope', function($scope) {
        //TODO share link resolution G+ & FB
        //TODO CSS
        //TODO paralax scrolling

    }])

    .controller('AuthCtrl', ['$scope', function($scope) {
        $scope.authenticate = function() {
            //build authentication url => https://developer.spotify.com/web-api/authorization-guide/
            //TODO authentication should be a service
            var accountUrl = 'https://accounts.spotify.com/authorize';
            var clientID ='client_id=2877dc4791af41e0b53de799f8cf2472';
            var redirectUri = 'redirect_uri=https%3A%2F%2Fslothtier.github.io%2Fquantify%2Findex.html';
            var authScope = 'scope=playlist-read-private';
            var responseType = 'response_type=token';
            var state = 'state=123';
            window.location.href = accountUrl+'?'+clientID+'&'+redirectUri+'&'+authScope+'&'+responseType+'&'+state;
        };

    }])

    .controller('DataCtrl', function($scope, $http, $rootScope) {
        $scope.invalidUrl = 'enter a valid spotify playlist url or uri';
        $scope.getPlaylistData = function() {

            //extract access token from url
            var accessToken = $rootScope.location.match(/([A-Za-z0-9_-]{155})/ig)[0];

            //validate entered url / uri
            //TODO validation should be a service
            //TODO username validation refactoring => should work for all usernames
            //TODO http://open.spotify.com/us/116564372/plast/1ZLV2ByYUXHUbEdODuUjN8 => should be invalid
            if ($scope.model === undefined || $scope.model === null || $scope.model.url.search(/[\w]{22}/ig) === -1) {
                $scope.invalidUrl = 'enter a valid spotify playlist url or uri';
                $scope.model.url = '';
                $scope.showPlaylist = false;
            } else {
                $scope.invalidUrl = '';
                $scope.errorMessage = '';

                //prepare request parameters
                var userID = $scope.model.url.match(/([A-Za-z0-9_]{8,40})/ig)[0];
                var playlistID = $scope.model.url.substr($scope.model.url.search(/[\w]{22}/ig),22);
                var apiUrl = 'https://api.spotify.com/v1/users/'+userID+'/playlists/'+playlistID;
                var authString = 'Bearer '+ accessToken;

                //get request for playlist data
                //TODO parsing playlist response should be a service

                //TODO fix for playlists of >100 tracks
                $http({method : 'GET',url : apiUrl, headers: {'Authorization': authString}}).
                    success(function(data) {

                        //decompose api response
                        var completeResponse = data;
                        var trackResponse = completeResponse.tracks;

                        //extract playlist name, track count & track items
                        $scope.playlistName = completeResponse.name;
                        $scope.playlistTrackcount = trackResponse.total;
                        $scope.playlistItems = trackResponse.items;

                        $scope.tracks = [];
                        $scope.tracklist = [];

                        //push all items into tracks
                        angular.forEach(trackResponse.items, function(item) {
                            $scope.tracks.push(item);
                        });
                        //push all tracks into tracklist
                        for(var i=0;i<Object.keys($scope.tracks).length;i++) {
                            $scope.tracklist.push($scope.tracks[i].track);
                        }

                        //calculate total playlist duration in ms
                        var durationMs = 0;
                        for(var j=0;j<Object.keys($scope.tracks).length;j++) {
                            durationMs = durationMs + $scope.tracklist[j].duration_ms;
                        };

                        //TODO time conversion should be a service
                        function msToTime(dur) {
                            var seconds = parseInt((dur/1000)%60)
                                , minutes = parseInt((dur/(1000*60))%60)
                                , hours = parseInt((dur/(1000*60*60))%24);
                            hours = (hours<10) ? '0' + hours : hours;
                            minutes = (minutes<10) ? '0' + minutes : minutes;
                            seconds = (seconds<10) ? '0' + seconds : seconds;

                            return hours + ' hr ' + minutes + ' min ' + seconds + ' sec';
                        };

                        //console.log('durationMs: '+durationMs);

                        $scope.playlistDuration = msToTime(durationMs);
                        $scope.durationMin = durationMs/1000/60;

                        //TODO siza calculations should be a service
                        //calculate idealized playlist sizes (12 20 40 KB/sec)
                        $scope.sizeNormalQuality = Math.ceil($scope.durationMin*60*12/1000);
                        $scope.sizeHighQuality = Math.ceil($scope.durationMin*60*20/1000);
                        $scope.sizeExtremeQuality = Math.ceil($scope.durationMin*60*40/1000);

                        //calculate real playlist sizes (11,5 19,2 35,1 KB/sec)
                        $scope.sizeNormalQualityReal = Math.ceil($scope.durationMin*60*11.5/1000);
                        $scope.sizeHighQualityReal = Math.ceil($scope.durationMin*60*19.2/1000);
                        $scope.sizeExtremeQualityReal = Math.ceil($scope.durationMin*60*35.1/1000);

                        //display playlist data
                        $scope.showPlaylist = true;

                    }).error(function(data) {
                        if(data.error.status === 401){
                            $scope.errorMessage = 'your access token has expired, please re-authenticate.';
                        } else if(data.error.status === 404) {
                            $scope.errorMessage = 'playlist data could not be found.';
                        } else {
                            $scope.errorMessage = 'uh oh.. something went horribly wrong.';
                        };
                        $scope.showPlaylist = false;
                        //console.log('api error: '+data);
                    });
            }





        };
    })


;
