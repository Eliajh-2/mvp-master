'use strict';

angular.module('artscan.controllers')
    .controller('EditProfileCtrl', function ($scope, $rootScope, $ionicHistory, $state, $ionicModal, localstorage) {


        $scope.editProfile = function () {
            $ionicModal.fromTemplateUrl('templates/edit-profile.html', {
                scope: $scope,
                animation: 'slide-in-up',
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });

        }

        $scope.cancelEdit = function () {
            $scope.modal.hide();
        }

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        // save edit
        $scope.saveEdit = function () {
            var user = localstorage.getObject('user');
            user.profilePic = $scope.profile.profilePic;
            localstorage.setObject('user', user);
            $scope.cancelEdit(); //close modal
        }

        //take picture
        $scope.takePicture = function () {


            var options = {
                quality: 50,
                sourceType: 1, 		// 0:Photo Library, 1=Camera, 2=Saved Album
                encodingType: 0,			// 0=JPG 1=PNG
                correctOrientation: true,
                allowEdit: false
            };

            navigator.camera.getPicture(function (imageURI) {

                console.log('imageURI: ' + imageURI);
                window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = 'tagr_' + name;

                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                        fileEntry.copyTo(fileSystem2, newName, function (entry) {
                            // save image to user object on localstorage
                            // console.log('Save url: ' + entry.nativeURL)
                            // var user = localstorage.getObject('user');
                            // user.profilePic = entry.nativeURL;
                            // localstorage.setObject('user', user);
                            $scope.profile.profilePic = entry.nativeURL;
                            $scope.$apply();

                        }, function (err) { // fail
                            console.log('err: ' + err.code);
                        });
                    }, function (err) { // fail
                        console.log('err: ' + err.code);
                    });
                }, function (err) { // fail
                    console.log('err: ' + err.code);
                });

            }, function (err) {
                console.log('no photos selected');
            }, options);
        };

        //choose picture from photo album
        $scope.selectPicture = function () {

            var options = {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: 2,
                encodingType: 0,
                correctOrientation: true
            };

            navigator.camera.getPicture(function (imageURI) {

                console.log('imageURI: ' + imageURI);
                window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = 'tagr_' + name;

                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                        fileEntry.copyTo(fileSystem2, newName, function (entry) {
                            // save image to user object on localstorage
                            // console.log('Save url: ' + entry.nativeURL)
                            // var user = localstorage.getObject('user');
                            // user.profilePic = entry.nativeURL;
                            // localstorage.setObject('user', user);
                            $scope.profile.profilePic = entry.nativeURL;
                            $scope.$apply();

                        }, function (err) { // fail
                            console.log('err: ' + err.code);
                        });
                    }, function (err) { // fail
                        console.log('err: ' + err.code);
                    });
                }, function (err) { // fail
                    console.log('err: ' + err.code);
                });

            }, function (err) {
                console.log('no photos selected');
            }, options);

        };

    })


