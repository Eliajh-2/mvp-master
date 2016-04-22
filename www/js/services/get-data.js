'use strict';

angular.module('artscan.services')
.factory('getSyncDataService', function($http, $q) {
 
    var getData = function(url) {
        var deferred = $q.defer();

        $http({method:"GET", url:url}).success(function(result){
            deferred.resolve(result);
        });

        return deferred.promise;
    };

    return { getData: getData };
})