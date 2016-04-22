'use strict';

angular.module('artscan.filters', [])
.filter('capitalize', function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    }
})

.filter('firstLetter', [function () {
	return function (input) {
		return input.charAt(0);
	}
}])

.filter('extractYear', [function () {
	return function (input) {
		return input.substr(10,4);
	}
}]);