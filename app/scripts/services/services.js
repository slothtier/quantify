'use strict';

/* Services */

angular.module('quantifyApp.services', [])

.factory('parseUrl', function() {
    var userID = '';
    var playlistID = '';
    var errorMessage = '';
    var urlHelper = '';

    var doParse = function(url) {
        //check if url/uri string is empty
        if (url === undefined || url === null || url === '') {
            console.log('im empty!: '+url);
            return "errorMessage = 'enter a valid spotify playlist url or uri.'";
        }
        //check if spotify url
        else if (url.search('http://open.spotify.com/user/') > -1 && url.search(/[\w]{22}/ig) > -1 ){
            url = url.replace('http://open.spotify.com/user/', '');
            urlHelper = url.split('/');
            userID = urlHelper[0];
            playlistID = urlHelper[2];
            console.log('im an url!: '+url);
            var id = {user : userID, playlist : playlistID};
            return id;
        }
        //check if spotify uri
        else if (url.search('spotify:user:') > -1 && url.search(/[\w]{22}/ig) > -1 ){
            url = url.replace('spotify:user:', '');
            urlHelper = url.split(':');
            userID = urlHelper[0];
            playlistID = urlHelper[2];
            console.log('im an uri!: '+url);
            return userID, playlistID;

        } else {
            console.log('im something else!: '+url);
            return errorMessage = 'enter a valid spotify playlist url or uri.';

        };
    };

    return {
        parse: function(url) {
            return doParse(url);
        }
    };
});