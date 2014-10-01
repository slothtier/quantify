/**
 * Created by nholzer on 01.10.2014.
 */
'use strict';

angular.module('quantifyApp.displayduration', [])

    .filter('displayduration', function() {
        return function(input) {
            var seconds = parseInt((input / 1000) % 60)
                , minutes = parseInt((input / (1000 * 60)) % 60)
                , hours = parseInt(input / (1000 * 60 * 60));
            hours = (hours < 10) ? '0' + hours : hours;
            minutes = (minutes < 10) ? '0' + minutes : minutes;
            seconds = (seconds < 10) ? '0' + seconds : seconds;
            return hours + ' hr ' + minutes + ' min ' + seconds + ' sec';
        }
    })