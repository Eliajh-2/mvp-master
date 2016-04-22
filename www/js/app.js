// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('artscan', ['ionic', 'artscan.controllers', 'artscan.services', 'artscan.directives', 'artscan.filters','ParseModule','ngCordova'])

.run(function($ionicPlatform, $ionicModal, $ionicBackdrop, $rootScope, $state, $ionicTabsDelegate) {

  $ionicPlatform.ready(function() {

    screen.lockOrientation('portrait');

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    // if (window.StatusBar) {
    //   // org.apache.cordova.statusbar required
    //   StatusBar.styleLightContent();
    // }

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
          console.log('fromState.name: ' + fromState.name + ' | toState.name: ' + toState.name);

          //tab.fullscreenimg state should rotate to landscape mode
          if (toState.name == "tab.fullscreenimg") {
              // allow user rotate
              screen.unlockOrientation();
          } else {
            screen.lockOrientation('portrait');
          }

          $rootScope.lastState = fromState.name;
          $rootScope.toState   = toState.name;
          $rootScope.login     = false;

          // // UI Router Authentication Check
          if (toState.data.authenticate && !Parse.User.current()) {
                console.log(Parse.User.current());

                $rootScope.openLoginModal();
                event.preventDefault();
          }

      });

  });
})

.config(function($ionicConfigProvider) {

  // config back button - no text
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('');

  // $ionicConfigProvider.platform.ios.tabs.style('standard'); 
  // $ionicConfigProvider.platform.ios.tabs.position('bottom');
  // $ionicConfigProvider.platform.android.tabs.style('standard');
  // $ionicConfigProvider.platform.android.tabs.position('standard');

  // $ionicConfigProvider.platform.ios.navBar.alignTitle('center'); 
  // $ionicConfigProvider.platform.android.navBar.alignTitle('left');

  // $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  // $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');  

  // $ionicConfigProvider.platform.ios.views.transition('ios'); 
  // $ionicConfigProvider.platform.android.views.transition('android');
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    data: {
      authenticate: false
    }
  })

  // Each tab has its own nav history stack:
  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })
    .state('tab.feed-artist', {
      url: '/feed/artist/:artistId',
      views: {
        'tab-feed': {
          templateUrl: 'templates/artist/artist.html',
          controller: 'ArtistCtrl'
        }
      },
      data: {
        authenticate: false
      }
    })
    .state('tab.feed-art', {
      url: '/feed/art/:itemId',
      views: {
        'tab-feed': {
          templateUrl: 'templates/art/art.html',
          controller: 'ArtCtrl'
        }
      },
      data: {
        authenticate: false
      }
    })
    .state('tab.feed-video', {
      url: '/feed/video/:itemId',
      views: {
        'tab-feed': {
          templateUrl: 'templates/video/video.html',
          controller: 'VideoCtrl'
        }
      },
      data: {
        authenticate: false
      }
    })
  .state('tab.fullscreenimg', {
    url: '/feed/fullscreenimg/:itemId/:slideId',
    views: {
      'tab-feed': {
        templateUrl: 'templates/fullscreenimg.html',
        controller: 'ArtCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('tab.favorites', {
      cache: false,
      url: '/favorites',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/tab-favorites.html',
          controller: 'FavoritesCtrl'
        }
      },
      data: {
        authenticate: false
      }
    })
    .state('tab.favorites-artist', {
      url: '/favorites/artist/:artistId',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/artist/artist.html',
          controller: 'ArtistCtrl'
        }
      },
      data: {
        authenticate: false
      }
    })
    .state('tab.favorites-art', {
      url: '/favorites/art/:itemId',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/art/art.html',
          controller: 'ArtCtrl'
        }
      },
      data: {
        authenticate: false
      }
    })

  .state('tab.scan', {
    url: '/scan',
    views: {
      'tab-scan': {
        templateUrl: 'templates/tab-scan.html',
        controller: 'ScanCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })
  .state('tab.addart', {
    url: '/scan/addart/:image',
    views: {
      'tab-scan': {
        templateUrl: 'templates/art/add-art.html',
        controller: 'AddArtCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('tab.map', {
    cache: false,
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('tab.profile', {
    cache: false,
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    },
    data: {
      authenticate: false
    }
  })

  .state('tab.edit-profile', {
    url: '/profile/edit-profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/edit-profile.html',
        controller: 'EditProfileCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  // .state('artist', {
  //   url: '/artist',
  //   views: {
  //     '': {
  //       templateUrl: 'templates/tab-profile.html',
  //       controller: 'ProfileCtrl'
  //     }
  //   },
  //   data: {
  //     authenticate: false
  //   }
  // })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/feed');

});
