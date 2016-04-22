'use strict';

angular.module('artscan.controllers')
.controller('ArtistCtrl', function($scope, $rootScope, $stateParams, FavoriteService, TagrService) {

    // get artist info
    TagrService.getArtist($stateParams.artistId)
    .success(function (response) {
            console.log('Response: '+JSON.stringify(response));
            $scope.artist = response.return;
            //$scope.isFavorite($scope.artist.uid);
    })
    .error(function (error, status, headers, config) {
            console.log('Error: '+JSON.stringify(error));
            console.log('Status: '+JSON.stringify(status));
            console.log('Headers: '+JSON.stringify(headers));
            console.log('Config: '+JSON.stringify(config));
    });

    // get artwork by this artist
    TagrService.getArtistArtwork($stateParams.artistId)
    .success(function (artworkResponse) {
        //console.log('Artwork: '+JSON.stringify(artworkResponse));
        $scope.artwork = artworkResponse.return.results;
    })
    .error(function (error, status, headers, config) {
        console.log('Error: '+JSON.stringify(error));
        console.log('Status: '+JSON.stringify(status));
        console.log('Headers: '+JSON.stringify(headers));
        console.log('Config: '+JSON.stringify(config));
    });

    // check if artist is fave
    $scope.isFave = false;
    $scope.isFavorite = function (id) {
      if (Parse.User.current()) {
        $scope.isFave = FavoriteService.isFavorite('artists',id);
        if($scope.isFave) {
            $scope.artist.followers++;
        }
      }
    } 
    
    $scope.favorites = function (id) {
      // check if user is logged in to fave art
      if (!Parse.User.current()) {
            console.log(Parse.User.current());
            $rootScope.openLoginModal();
      } else {
        if($scope.isFave) {
            if(FavoriteService.remove('artists',$stateParams.artistId)) {
                $scope.isFave = !$scope.isFave;
                $scope.artist.followers--;
            }
        } else {
            if(FavoriteService.add('artists',$stateParams.artistId)) {
                $scope.isFave = !$scope.isFave;
                $scope.artist.followers++;
            }
        }
      }

    }
})