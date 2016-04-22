'use strict';

angular.module('artscan.controllers')
.controller('AppCtrl', function($scope,$rootScope,$state,$ionicModal,$ionicPopup,$cordovaSplashscreen,FeedService,localstorage,TagrService) {

    // tmp
    $scope.imageHost = 'http://www.tagr.in/';

    // load feed content
    $scope.loadFeed = function() {
        // tmp. reenabled
         FeedService.all().then(function (feed) {
           $scope.feedOld = feed;
         });


        $scope.feedNavigation = [];

        TagrService.getFeed()
        .success(function (response) {
            $scope.lastFeedItem = response.last_item_id;

            // check if got to the end of feed
            if($scope.lastFeedItem != '') {
                $scope.moreFeedItems = true;
            } else {
                $scope.moreFeedItems = false;
            }

            $scope.feed = response.return.results;

            angular.forEach($scope.feed,function(value) {
                $scope.feedNavigation.push(value.uid);
            });

            $scope.hideSplashScreen();

        })
        .error(function (error, status, headers, config) {
            // TODO: display message to user

            $scope.feed = false;

            console.log('Error: '+JSON.stringify(error));
            console.log('Status: '+JSON.stringify(status));
            console.log('Headers: '+JSON.stringify(headers));
            console.log('Config: '+JSON.stringify(config));

            $scope.hideSplashScreen();

        });

    }
        

    $scope.hideSplashScreen = function () {
        if ($cordovaSplashscreen) {
           // Hide splash Screen
           setTimeout(function() {
              $cordovaSplashscreen.hide();
           }, 1000);
        }
    }


    // open login modal
    $rootScope.openLoginModal = function (evt) {
        $ionicModal.fromTemplateUrl('templates/modal/login.html', {
          scope: $scope,
          animation: 'slide-in-up'
        })
        .then(function(modal) {
          $scope.loginModal = modal;
          $scope.loginModal.show();
        });
    }

    $rootScope.closeLoginModal = function() {
        console.log('closing login modal');
        $scope.loginModal.hide();
        //console.log("go to previous state: "+$rootScope.lastState);
        //$state.go($rootScope.lastState, {}, {reload: true});
    };

    $rootScope.isLoggedIn = function() {
        return Parse.User.current();
    };

    $scope.$on('$destroy', function() {
      $scope.loginModal.remove();
    });

    $scope.login = function (service, isModal) {

        switch (service) {

            case  'facebook':
                $rootScope.loginFacebook(isModal);
                break;

            default:
                break;
        }
    }

        // sign up with Facebook and Parse
    var fbLogged = new Parse.Promise();

    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            return;
        }
        var expDate = new Date(
            new Date().getTime() + response.authResponse.expiresIn * 1000
        ).toISOString();

        var authData = {
            id: String(response.authResponse.userID),
            access_token: response.authResponse.accessToken,
            expiration_date: expDate
        }
        fbLogged.resolve(authData);
        fbLoginSuccess = null;
        console.log(response);
    };

    var fbLoginError = function(error){
        fbLogged.reject(error);
    };

        $rootScope.loginFacebook = function(isModal) {

            console.log('you tapped on facebook login');

            // save current state here as it will be changed to state = 'feed' after login(?)
            var currentState = $rootScope.toState;

            if (!window.cordova) {
                facebookConnectPlugin.browserInit('1604073766529081');
            }
            facebookConnectPlugin.login(['email','public_profile'], fbLoginSuccess, fbLoginError);
            fbLogged.then( function(authData) {
                console.log('Promised');
                return Parse.FacebookUtils.logIn(authData);
            })
                .then( function(userObject) {
                    var authData = userObject.get('authData');
                    facebookConnectPlugin.api('/me', null,
                        function(response) {
                            console.log(response);
                            userObject.set('name', response.name);
                            userObject.set('firstname', response.first_name);
                            userObject.set('lastname', response.last_name);
                            userObject.set('email', response.email);
                            userObject.set('gender', response.gender);
                            userObject.set('serviceUserID', response.id);
                            userObject.set('profilePic', "http://graph.facebook.com/" + response.id + "/picture?type=small");
                            userObject.save();

                            localstorage.setObject('user',userObject);

                        },
                        function(error) {
                            console.log(error);
                        }
                    );

                    if ( isModal ) {
                        $rootScope.lastState = currentState;
                        $rootScope.closeLoginModal();
                    }

                    $rootScope.$broadcast('loginEvent', userObject);

                }, function(error) {
                    console.log(error);
                });
        }

        $rootScope.logout = function() {
            // confirm logout
            var confirmPopup = $ionicPopup.confirm({
                title: 'Are you sure you want to log out?',
                cssClass: 'logout-confirm-popup',
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: 'Cancel',
                    type: 'button-default',
                    onTap: function(e) {
                    }
                }, {
                    text: 'Confirm',
                    type: 'button-positive',
                    onTap: function(e) {
                        return true;
                    }
                }]
            });
            confirmPopup.then(function(res) {
                console.log(res);
                if(res) {
                    // logout of Parse and Facebook
                    console.log('Logout');
                    Parse.User.logOut();
                    $rootScope.$broadcast('logoutEvent');
                    console.log('logoutEvent broadcast');
                } else {
                    console.log('Cancel');
                }
            });

        }

})


