'use strict';

angular.module('quantifyApp.calculation', [])

    .factory('size', function () {
        var size = function (duration, quality) {
            switch (quality) {

                //calculate idealized playlist sizes assuming 12/20/40 KB/sec

                case 'normal':
                    duration = duration * 12 / 1000;
                    break;
                case 'high':
                    duration = duration * 20 / 1000;
                    break;
                case 'extreme':
                    duration = duration * 40 / 1000;
                    break;

                //calculate real playlist sizes (11,5 19,2 35,1 KB/sec)

                case 'normal_real':
                    duration = duration * 11.5 / 1000;
                    break;
                case 'high_real':
                    duration = duration * 19.2 / 1000;
                    break;
                case 'extreme_real':
                    duration = duration * 35.1 / 1000;
                    break;
            }
            return duration;
        }
        return {
            calculate: function (duration, quality) {
                return size(duration, quality);
            }
        }
    })