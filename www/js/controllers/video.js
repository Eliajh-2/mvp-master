'use strict';

angular.module('artscan.controllers')
.controller('VideoCtrl', function ($scope,$stateParams,VideoService) {

  // get video details
  $scope.video  = VideoService.get($scope.feed,$stateParams.itemId);

})