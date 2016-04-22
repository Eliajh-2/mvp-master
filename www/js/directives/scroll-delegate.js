'use strict';

angular.module('artscan.directives')
.directive('scrollDetector', function($window, $ionicScrollDelegate) {
    return {
        restrict : 'A',
        link: function(scope, element, attrs) {
            element.on('scroll', function() {
                scope.scrollHandler();
            });
        }
    };
})

angular.module('artscan.directives')
.directive('isolate', function() {
    return {scope: true};
});
