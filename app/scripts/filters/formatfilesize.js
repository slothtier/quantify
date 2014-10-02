'use strict';

angular.module('quantifyApp.formatfilesize', [])

    .filter('formatunit', function() {
        return function(input) {
            if (input <= 1000) {
                return '~ '+Math.round(input)+' MB';
            } else {
                return  '~ '+(input/1000).toFixed(2) + ' GB';
            }
        }
    })