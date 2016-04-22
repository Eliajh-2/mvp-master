'use strict';

angular.module('artscan.controllers')
.controller('FullscreenImgCtrl', function($scope,$filter,$stateParams,ArtService) {

    $scope.activeSlide = $stateParams.slideId;
    $scope.art = ArtService.get($scope.feed,$stateParams.itemId);
    $scope.numberOfImgs = $scope.art.imgs.length;

    // $scope.updateSlideStatus = function(slide) {
    //   var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    //   if (zoomFactor == $scope.zoomMin) {
    //     $ionicSlideBoxDelegate.enableSlide(true);
    //   } else {
    //     $ionicSlideBoxDelegate.enableSlide(false);
    //   }
    // };
})