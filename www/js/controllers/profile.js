'use strict';

angular.module('artscan.controllers')
.controller('ProfileCtrl', function ($scope, $rootScope, $state, $timeout, localstorage) {


    $scope.init = function () {
        $scope.update();
    }

    $scope.update = function () {
        if ($rootScope.isLoggedIn()) {
            $scope.profile = localstorage.getObject('user');
            //$scope.profilePic = "http://graph.facebook.com/" + $scope.profile.serviceUserID + "/picture?type=small";
        }
    }
    
    $scope.editProfile = function () {
        $state.go('tab.edit-profile');
    }

    $scope.$on('loginEvent', function (event, args) {
        console.log('in LoginEvent (profile)');
        // todo: not happy about having to use a timed call (context/thread issue after FB login?)
        $timeout(function () {
            $scope.update()
        }, 250);
    })

    $scope.$on('logoutEvent', function (event, args) {
            $scope.update()
    })


})



