'use strict';

/* Controllers */

angular.module('quantifyApp.controllers', [])
     .controller('QuantifyCtrl', ['$scope', function($scope) {
        //TODO share link resolution G+ & FB
        //TODO CSS
        //TODO paralax scrolling
        //TODO SEO

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

    .controller('MainCtrl', function($scope, $http, $rootScope, parseUrl, playlistService, trackService, $q) {
        $scope.invalidUrl = 'enter a valid spotify playlist url or uri.';

        $scope.quantify = function() {

            if (parseUrl.parse($scope.model.url).user === undefined){
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
                var apiUrl = 'https://api.spotify.com/v1/users/'+userID+'/playlists/'+playlistID;

                //extract token from url
                var authString = 'Bearer '+ $rootScope.location.match(/([A-Za-z0-9_-]{155})/ig)[0];

                //get request for playlist data
                //TODO parsing playlist response should be a service
                //TODO fix for playlists of >100 tracks





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
                        var tracklistNew = [];
                        var apiUrlTracks = apiUrl+'/tracks';

                        console.log('trackResponse.total: '+trackResponse.total);




                        //calculate total duration in ms


                        var apiUrlTracksNew = apiUrlTracks;
                        var x = 0
                        var dataHelper = 0;
                        var dataHelper1 = 0;
                        var deferred = $q.defer();
                        var reqPromises = [];
                        var y = 0;

                        function bla(){


                            for (x; x < trackResponse.total;) {
                                //console.log('im in the loop: ' + x);
                                //console.log('calling : ' + apiUrlTracksNew);

                                trackService.getTracks(apiUrlTracksNew, authString)
                                    .then(function (data) {
                                        //console.log('result of service: ' + data);
                                        dataHelper = data;
                                        dataHelper1 = dataHelper1 + dataHelper;
                                        console.log('dataHelper1 in loop = ' + dataHelper1);

                                        reqPromises.push(dataHelper1);
                                        console.log('y: '+y);
                                        console.log('reqPromises: '+reqPromises[y]);
                                        y = y+1;
                                        if (reqPromises.length = y) {
                                            $q.all(reqPromises).then(function () {
                                                deferred.resolve();
                                                $scope.totalduration = dataHelper1;
                                            });
                                        }

                                    }, function (error) {
                                        console.log('error :', error.error.status);
                                    });

                                x = x + 100;
                                apiUrlTracksNew = apiUrlTracks + '?offset=' + x;
                                //console.log('new url to call: ' + apiUrlTracksNew);
                                console.log('x = ' + x);


                            }

                            return deferred.promise;




                        }
                        var test = bla();
                        console.log('test: '+test[6]);

                        function ensureModule(name) {
                            var deferred = $q.defer(),
                                moduleState = modulesLoaded[name];
                            if (moduleState === true) {
                                deferred.resolve();
                            } else if (moduleState && moduleState.then) {
                                moduleState.then(function () {
                                    deferred.resolve();
                                });
                            } else {
                                modulesLoaded[name] = loadModule(name).then(function (module) {
                                    var reqPromises = [];
                                    if (module.requires && module.requires.length) {
                                        module.requires.forEach(function (reqName) {
                                            reqPromises.push(ensureModule(reqName));
                                        });
                                    }
                                    if (module.requiresCss && module.requiresCss.length) {
                                        reqPromises.push(requireCSS(module.requiresCss.map(buildPath)));
                                    }
                                    if (module.requiresHtml) {
                                        var templatePaths = module.requiresHtml;
                                        if (!angular.isArray(templatePaths)) {
                                            templatePaths = [templatePaths];
                                        }
                                        _.each(templatePaths, function (path) {
                                            reqPromises.push(requireHTML(buildPath(path)));
                                        });
                                    }

                                    if (reqPromises.length > 0) {
                                        $q.all(reqPromises).then(function () {
                                            deferred.resolve();
                                        });
                                    } else {
                                        deferred.resolve();
                                    }

                                });
                            }
                            return deferred.promise;

                        }










                        var tracks = [];
                        var tracklist = [];

                        //push all items into tracks array
                        angular.forEach(trackResponse.items, function(item) {
                            tracks.push(item);
                        });
                        //push all tracks into tracklist array
                        for(var i=0;i<Object.keys(tracks).length;i++) {
                            tracklist.push(tracks[i].track);
                        }

                        //calculate total playlist duration in ms
                        var durationMs = 0;
                        for(var j=0;j<Object.keys(tracks).length;j++) {
                            durationMs = durationMs + tracklist[j].duration_ms;
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

                        $scope.playlistDuration = msToTime(durationMs);
                        $scope.durationMin = durationMs/1000/60;

                        //TODO size calculations should be a service
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

                    }, function (error) {
                        console.log('error :', error.error.status);
                        switch (error.error.status) {
                            case 401:
                                $scope.errorMessage = 'your access token has expired, please re-authenticate.';
                                break;
                            case 404:
                                $scope.errorMessage = 'playlist data could not be found.';
                                break;
                            case 429:
                                $scope.errorMessage = 'too many requests (rate limited)';
                                break;
                            case 503:
                                $scope.errorMessage = 'Spotify appears to experience some problems currently.';
                                break;
                            default:
                                $scope.errorMessage = 'uh oh.. something went horribly wrong.';
                        }
                        $scope.showPlaylist = false;

                    });


                /*
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

                        //push all items into tracks array
                        angular.forEach(trackResponse.items, function(item) {
                            $scope.tracks.push(item);
                        });
                        //push all tracks into tracklist array
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

                        $scope.playlistDuration = msToTime(durationMs);
                        $scope.durationMin = durationMs/1000/60;

                        //TODO size calculations should be a service
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

                    }).error(function (data) {
                        switch (data.error.status) {
                            case 401:
                                $scope.errorMessage = 'your access token has expired, please re-authenticate.';
                                break;
                            case 404:
                                $scope.errorMessage = 'playlist data could not be found.';
                                break;
                            case 429:
                                $scope.errorMessage = 'too many requests (rate limited)';
                                break;
                            case 503:
                                $scope.errorMessage = 'Spotify appears to experience some problems currently.';
                                break;
                            default:
                                $scope.errorMessage = 'uh oh.. something went horribly wrong.';
                        }
                        $scope.showPlaylist = false;
                        //console.log('api error: '+data);
                    });
                    */
            }





        };
    })


;
