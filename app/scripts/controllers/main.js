'use strict';

/* Controllers */

angular.module('quantifyApp.controllers', [])
     .controller('QuantifyCtrl', ['$scope', function($scope) {

    }])

    .controller('AuthCtrl', ['$scope', function($scope) {
        $scope.authenticate = function() {
            window.location.href = 'https://accounts.spotify.com/authorize?client_id=2877dc4791af41e0b53de799f8cf2472&redirect_uri=http%3A%2F%2Fslothtier.github.io%2Fquantify%2Findex.html&scope=playlist-read-private&response_type=token&state=123';
            console.log('clicked the auth button');
        };

    }])

    .controller('DataCtrl', function($scope, $http, $rootScope) {
        $scope.getPlaylistData = function() {
            //console.log($rootScope.location);
            //console.log("bla!");
            var accessToken = $rootScope.location.match(/([A-Za-z0-9_-]{155})/ig)[0];


            $http({method : 'POST',url : 'https://accounts.spotify.com/api/token', headers: { 'Authorization':'Basic Mjg3N2RjNDc5MWFmNDFlMGI1M2RlNzk5ZjhjZjI0NzI6MTUzOWEzY2ZjMzRmNGRlYmI5YjRkODA2Y2JmMDNmN2U=', 'grant_type':'client_credentials', 'Access-Control-Allow-Origin':'*'}}).
                success(function(token) {
                    $scope.tokenData = token;
                }).error(function() {
                    /* alert("token not retrieved") */
                });

            if ($scope.model === undefined || $scope.model === null || $scope.model.url.search(/[\w]{22}/ig) === -1) {
                window.alert('please enter a valid spotify playlist url or uri');
            } else {

                var userID = $scope.model.url.match(/([A-Za-z0-9_]{8,40})/ig)[0];
                var playUrl = $scope.model.url.substr($scope.model.url.search(/[\w]{22}/ig),22);
                var apiUrl = 'https://api.spotify.com/v1/users/'+userID+'/playlists/'+playUrl+'/tracks';
                var authString = 'Bearer '+ accessToken;
                $http({method : 'GET',url : apiUrl, headers: {'Authorization': authString}}).
                    success(function(data) {
                        $scope.playlistName = data.name;
                        $scope.playlistTrackcount = data.total;

                        $scope.playlistItems = data.items;

                        $scope.tracks = [];
                        $scope.tracks2 = [];
                        $scope.range = [];
                        angular.forEach(data.items, function(item) {
                            $scope.tracks2.push(item);

                            angular.forEach($scope.tracks2.track, function(bla){
                                $scope.tracks.push(bla);

                            });



                        });

                        for(var i=0;i<Object.keys($scope.tracks2).length;i++) {
                            $scope.range.push($scope.tracks2[i].track);
                        }
                        var totalduration = 0;

                        for(var j=0;j<Object.keys($scope.tracks2).length;j++) {
                            totalduration = totalduration + $scope.range[j].duration_ms;
                            console.log(totalduration);
                        }
                        $scope.total = totalduration;
                        $scope.durationinmin = totalduration/1000/60;
                        $scope.totalduration = Math.ceil($scope.durationinmin);
                        console.log($scope.tracks2);
                        console.log($scope.range);
                        console.log($scope.total);
                        console.log($scope.tracks2[0]);
                        console.log($scope.model.url);
                        console.log(Object.keys($scope.tracks2).length);
                        console.log(Object.keys($scope.tracks2).keys);
                        $scope.testtest = $scope.tracks2;
                        $scope.log = [];
                        angular.forEach($scope.testtest, function(value, key) {
                            $scope.log.push(key + ': ' + value);
                            console.log($scope.log);
                        });
                        var sizeNormalQuality = 0;
                        var sizeHighQuality = 0;
                        var sizeExtremeQuality = 0;
                        sizeNormalQuality = Math.ceil($scope.durationinmin*60*12/1000);
                        $scope.sizeNormalQuality = sizeNormalQuality;
                        sizeHighQuality = Math.ceil($scope.durationinmin*60*20/1000);
                        $scope.sizeHighQuality = sizeHighQuality;
                        sizeExtremeQuality = Math.ceil($scope.durationinmin*60*40/1000);
                        $scope.sizeExtremeQuality = sizeExtremeQuality;
                        console.log($scope.sizeNormalQuality);
                        console.log($scope.sizeHighQuality);
                        console.log($scope.sizeExtremeQuality);
                        $scope.showPlaylist = true;
                    }).error(function() {
                        window.alert('playlist data could not be loaded');
                    });
            }





        };
    })


    .controller('UrlCtrl', ['$scope', function($scope) {
        $scope.url = $scope.model.url;

    }]);
