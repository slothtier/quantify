'use strict';

angular.module('quantifyApp.errorhandling', [])

    .filter('apiError', function() {
        return function(input) {
            var errorMessage = '';
            switch (input) {
                case '':
                    errorMessage = '';
                    break;
                case undefined:
                    errorMessage = '';
                    break;
                case 401:
                    errorMessage = '~ your access token has expired, please <a href="#">re-authenticate</a> ~';
                    break;
                case 404:
                    errorMessage = '~ playlist could not be found ~';
                    break;
                case 429:
                    errorMessage = '~ too many requests, please try again later ~';
                    break;
                case 503:
                    errorMessage = '~ the Spotify API appears to experience technical difficulties currently ~';
                    break;
                default:
                    errorMessage = '~ uh oh.. something went horribly wrong ~';
            }
            return errorMessage;
        }
    })

    .filter('validationError', function() {
        return function() {
            return 'enter a valid spotify playlist url or uri';
        }
    })