'use strict';

angular.module('quantifyApp.scrolling', [])

    .directive('scrollOnClick', function() {
        return {
            restrict: 'A',
            scope: {
                scrollTo: "@"
            },
            link: function(scope, $elm) {

                $elm.on('click', function() {
                    $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top }, "slow");
                });
            }
        }})

    .directive('scrollOnSubmit', function() {
        return {
            restrict: 'A',
            scope: {
                scrollTo: "@"
            },
            link: function(scope, $elm) {

                $elm.on('submit', function() {
                    $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top }, "slow");
                });
            }
        }})