'use strict';

angular.module('artscan.services')
.factory('CameraService', ['$q', function($q) {

	return {
		getPicture: function(options) {
			var q = $q.defer();
//			var pictureObject = {};
			options = options || {};
			options.destinationType = 0;// Base64 file

			navigator.camera.getPicture(
				// Success
				function(file) {
					q.resolve(file);
				}, 
				// Error
				function(err) {
					q.reject(err);
				}, options);

			return q.promise;
		}
	};

}]);