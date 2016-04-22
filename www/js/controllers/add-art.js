'use strict';

angular.module('artscan.controllers')

.controller('AddArtCtrl', function($scope, $state, $stateParams, $ionicActionSheet, $ionicPopup, $timeout, SharingService) {

        $scope.addImg            = $stateParams.image;
        $scope.isActionSheetOpen = true;

        $scope.shareFB = function() {
            cordova.plugins.clipboard.copy('Check out street art on Tagr!')
            SharingService.shareViaFaceBook(
                {
                    message: 'Check out street art on Tagr!',
                    imageLink : ' http://www.tagr.in/img/temp/arlin/primary.jpg'
                });
        }

        $scope.shareTwitter = function() {
            SharingService.shareViaTwitter(
                {
                    message: 'Check out street art on Tagr!',
                    imageLink : ' http://www.tagr.in/img/temp/arlin/primary.jpg'
                });
		}

         // Triggered on init
         $scope.showActionSheet = function() {

               // Show the action sheet
               var hideSheet = $ionicActionSheet.show({
                 buttons: [
                   { text: '<span class="tagr-red">Post to <span class="tagr-font">TAGR</span></span>' },
                   { text: '<span class="tagr-red">Add artist info</span>' },
                 ],
                 cancelText: '<span class="tagr-red">Cancel</span>',
                 cancel: function() {
                      $state.go("tab.scan", {});
                    },
                 buttonClicked: function(index) {
                        switch (index) {
                             case 0:
                                $scope.isActionSheetOpen = true;
                                $scope.showPopup();
                                break;
                             case 1:
                                $scope.isActionSheetOpen = false;
                                $scope.checked = false;
                                break;
                             case 2:
                                $scope.isActionSheetOpen = false;
                                $scope.checked = true;
                                break;
                             default:
                                break;
                        }
                       return true;
                 }
               });
         };

        // Triggered when user selects 'Post to Feed' button
        $scope.showPopup = function() {
          var myPopup = $ionicPopup.show({
            template: '<span class="tagr-red">Thanks for contributing to <span class="tagr-font">TAGR</span>!</span>',
            cssClass: 'modal-confirm'
          });
          $timeout(function() {
             myPopup.close(); //close the popup after 2 seconds
             $state.go("tab.scan", {});
          }, 2500);
        }

})