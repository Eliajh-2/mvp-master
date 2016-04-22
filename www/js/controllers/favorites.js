'use strict';

angular.module('artscan.controllers')
.controller('FavoritesCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, ArtService, ArtistsService, FavoriteService, TagrService) {

    // available filters
    $scope.favoritesFilters = [
        { text: "Art",      value: "art" },
        { text: "Artists",  value: "artists" },
        { text: "My Fans",     value: "fans" },
    ];

    // initial selection
    $scope.data = {currentSelected : 'art'};

    $scope.loadFavoritesList = function (filter) {
        var faves = FavoriteService.getFavoritesPerType(filter);
        console.log('faves: '+faves);
        if(faves === null) {
          $scope.favesList = faves;
        } else {
          var eachFave = [];
          angular.forEach(faves, function(value) {
            this.push(ArtService.get($scope.feed,value));
          }, eachFave);
          //console.log('eachFave: '+JSON.stringify(eachFave));
          $scope.favesList = eachFave;
        }

        //to scroll favorite lists to top upon clicking sub nav btns
        setTimeout(function() {
            $ionicScrollDelegate.$getByHandle('favoriteScroll').scrollTop();
        }, 50);
    }
    $scope.loadFavoritesList($scope.data.currentSelected);



    $scope.$on('loginEvent', function (event, args) {
        console.log('in LoginEvent (faves)');
        // todo: not happy about having to use a timed call (context/thread issue after FB login?)
        $timeout(function () {
            $rootScope.isLoggedIn();
        }, 250);
    })

   


    //setTimeout(function() {
    //var delegate = $ionicScrollDelegate.$getByHandle('favoriteScroll');

    // rest of related code included here...

//},10);

    //$timeout(function(){
    //  $ionicScrollDelegate.$getByHandle('favoriteScroll').scrollTop(false);  
    //},50)

    //$timeout(function() {
     //  $ionicScrollDelegate.$getByHandle('favoriteScroll').anchorScroll('start');
    //}, 10);
})