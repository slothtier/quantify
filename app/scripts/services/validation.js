'use strict';

/* Services */

angular.module('quantifyApp.validation', [])

    .factory('url', function () {

        var validateUrl = function (url) {
            //check if spotify url
            if (url.search('http://open.spotify.com/user/') > -1 && url.search(/[\w]{22}/ig) > -1 && url.search('/playlist/') > -1) {
                url = url.replace('http://open.spotify.com/user/', '');
                var urlHelper = url.split('/');
                return {user: urlHelper[0], playlist: urlHelper[2]};

            }
            //check if spotify uri
            else if (url.search('spotify:user:') > -1 && url.search(/[\w]{22}$/ig) > -1 && url.search(':playlist:') > -1) {
                url = url.replace('spotify:user:', '');
                var urlHelper = url.split(':');
                return {user: urlHelper[0], playlist: urlHelper[2]};

            } else {
                return false;
            }
        };
        return {
            validate: function (url) {
                return validateUrl(url);
            }
        };
    })