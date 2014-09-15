'use strict';

/* Services */

angular.module('quantifyApp.services', [])

    .factory('parseUrl', function () {

        var doParse = function (url) {
            //check if spotify url
            if (url.search('http://open.spotify.com/user/') > -1 && url.search(/[\w]{22}/ig) > -1 && url.search('/playlist/') > -1) {
                url = url.replace('http://open.spotify.com/user/', '');
                var urlHelper = url.split('/');
                var id = {user: urlHelper[0], playlist: urlHelper[2]};
                return id;
            }
            //check if spotify uri
            else if (url.search('spotify:user:') > -1 && url.search(/[\w]{22}$/ig) > -1 && url.search(':playlist:') > -1) {
                url = url.replace('spotify:user:', '');
                var urlHelper = url.split(':');
                var id = {user: urlHelper[0], playlist: urlHelper[2]};
                return id;
            } else {
                return 'enter a valid spotify playlist url or uri.';
            }
            ;
        };
        return {
            parse: function (url) {
                return doParse(url);
            }
        };
    })

    .factory('playlistData', function ($http) {

        var getPlaylistData = function (apiUrl, authString) {

            $http({method: 'GET', url: apiUrl, headers: {'Authorization': authString}}).
                success(function (data) {
                    //decompose api response
                    var completeResponse = data;
                    var trackResponse = completeResponse.tracks;

                    //extract playlist name, track count & track items

                    var playlistItems = trackResponse.items;


                    var tracks = [];
                    var tracklist = [];

                    //push all items into tracks array
                    angular.forEach(trackResponse.items, function (item) {
                        tracks.push(item);
                    });
                    //push all tracks into tracklist array
                    for (var i = 0; i < Object.keys(tracks).length; i++) {
                        tracklist.push(tracks[i].track);
                    };

                    //calculate total playlist duration in ms
                    var durationMs = 0;
                    for (var j = 0; j < Object.keys(tracks).length; j++) {
                        durationMs = durationMs + tracklist[j].duration_ms;
                    };

                    console.log('name: '+completeResponse.name+' count: '+trackResponse.total+' duration: '+durationMs);
                    //var playlist = {'name': completeResponse.name, trackCount: trackResponse.total, durationMs: durationMs};

                    return {'name': completeResponse.name, trackCount: trackResponse.total, durationMs: durationMs};

                }).error(function (data) {
                    var errorMessage = '';
                    switch (data.error.status) {
                        case 401:
                            errorMessage = 'your access token has expired, please re-authenticate.';
                            break;
                        case 404:
                            errorMessage = 'playlist data could not be found.';
                            break;
                        case 429:
                            errorMessage = 'too many requests (rate limited)';
                            break;
                        case 503:
                            errorMessage = 'Spotify appears to experience some problems currently.';
                            break;
                        default:
                            errorMessage = 'uh oh.. something went horribly wrong.';
                    }
                    ;
                });
        };
        return {
            getData: function (apiUrl, authString) {
                return getPlaylistData(apiUrl, authString);
            }
        };
    });