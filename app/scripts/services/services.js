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

    .factory('playlistService', function ($http, $q) {
        return {
            getPlaylist: function(apiUrl, authString) {
                return $http({method : 'GET',url : apiUrl, headers: {'Authorization': authString}})
                    .then(function(response) {
                            return response.data;
                    }, function(response) {
                        //api error
                        return $q.reject(response.data);
                    });
            }
        };
    });