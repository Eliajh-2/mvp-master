'use strict';

angular.module('artscan.controllers')
.controller('ArtCtrl', function($scope, $rootScope, $location, $anchorScroll, $stateParams, $state, $timeout, $interval,
                                $ionicModal, $ionicHistory, $ionicNavBarDelegate, $ionicViewSwitcher,
                                $ionicSlideBoxDelegate, $ionicScrollDelegate, ArtService, ArtistsService,
                                SharingService, FavoriteService, TagrService) {


        // get art details
        TagrService.getArtworkbyId($stateParams.itemId)
        .success(function (response) {
            $scope.art = response.return;
            //console.log('Art Details: '+JSON.stringify($scope.art));

            $scope.loadMap();
            $scope.isFavorite($scope.art.uid); // get initial value

            // tmp
            var i;
            for (i=0 ; i < 6; i++) {
                $scope.imgs[i] = $scope.art.thumb.src;
            }
        })
        .error(function (error, status, headers, config) {
            console.log('Error: '+JSON.stringify(error));
            console.log('Status: '+JSON.stringify(status));
            console.log('Headers: '+JSON.stringify(headers));
            console.log('Config: '+JSON.stringify(config));

        });

        // tmp only!
        $scope.artOld;

        $scope.multipleArtists = false;
        $scope.currArtIdx;
        $scope.artmap;
        $scope.selectedImgIndex = 0;
        $scope.fullScreenMode = false;
        $scope.timer = undefined;
        $scope.imgs = [];



        $scope.init = function() {
            console.log('*** Detail View Init');

            $scope.artOld = $scope.getFeedData($scope.feedOld, 9);

            // get current feed art index
            var keysbyindex = Object.keys($scope.feedOld);
            for (var i = 0; i < keysbyindex.length; i++) {
                if ($scope.feedOld[i].id == $stateParams.itemId) {
                    //console.log('init to: id: ' + $scope.feed[i].id + ' at index: ' + i);
                    $scope.currArtIdx = i;
                }
            }


            // get currArtIdx for feed navigation purposes
            angular.forEach($scope.feedNavigation,function(value,key) {
                if($stateParams.itemId == parseInt(value))
                    $scope.currArtIdx = key;
            });


            window.addEventListener("orientationchange", function(){
                console.log('Orientation changed to ' + screen.orientation);
                $scope.setImageOrientation();
            });

        }

        // tmp
        $scope.getFeedData = function (art, artId) {
            for (var i = 0; i < art.length; i++) {
                if (art[i].id === parseInt(artId)) {
                    return art[i];
                }
            }
            return null;
        }

        $scope.repeatFinished = function (id) {
            if ( id.indexOf('thumb') != -1 ) {
                console.log('thumb side box ng-repeat finished');

                $timeout(function() {
                    // tmp: to work around an error that iccurs after swiping and previoius view is unloaded
                    $scope.mainImageSwap($scope.art.uid, $scope.selectedImgIndex,
                        $scope.imgs[$scope.selectedImgIndex]);
                },750);


                return;
            }

            console.log('full screen slide box ng-repeat finished');
            $('.detailFullScreen').removeClass('fullScreenDetailOffscreen');
            $('.detailFullScreen').hide();
        };

        $scope.setImageOrientation = function() {
            if (screen.orientation.indexOf('landscape') != -1) {
                console.log("switched to: landscape");
                $scope.setImageForLandscape();
            } else {
                console.log("switched to: portrait");
                $scope.setImageForPortrait();
            }
        }

        $scope.setImageForLandscape = function() {
            $(".detailFullScreen img").removeClass('centerPortrait').addClass('centerLandscape');
        }


        $scope.setImageForPortrait = function() {
            $(".detailFullScreen img").removeClass('centerLandscape').addClass('centerPortrait');

        }

        $scope.isFave = false;
        $scope.isFavorite = function (id) {
            if (Parse.User.current()) {
                $scope.isFave = FavoriteService.isFavorite('art',id);
            }
        }

        $scope.favorites = function (id) {
            // check if user is logged in to fave artist
            if (!Parse.User.current()) {
                console.log(Parse.User.current());
                $rootScope.openLoginModal();
            } else {
                if($scope.isFave) {
                    if(FavoriteService.remove('art',id)) {
                        $scope.isFave = !$scope.isFave;
                    }
                } else {
                    if(FavoriteService.add('art',id)) {
                        $scope.isFave = !$scope.isFave;
                    }
                }
            }

        }


        $scope.showDetail = function() {
            $('.detailContent').show();
            $('.detailFullScreen').hide();
        }

        $scope.showFull = function() {

            $('.detailContent').hide();
            $('.detailFullScreen').show();
        }


        $scope.toggleFullScreenMode = function () {

            // if detail image is not full visible
            var scrollPos = $ionicScrollDelegate.$getByHandle('detail-scroll').getScrollPosition();
            if ( !$scope.fullScreenMode && scrollPos.top != 0 ) {
                $ionicScrollDelegate.$getByHandle('detail-scroll').scrollTop(true);
                return;
            }

            $scope.fullScreenMode = !$scope.fullScreenMode;
            if ( !$scope.fullScreenMode ) {
                $ionicNavBarDelegate.showBar(true);
                $scope.showDetail();
                screen.lockOrientation('portrait');
                $scope.loadMap();
                $scope.mainImageSwap($stateParams.itemId, $scope.selectedImgIndex,  $scope.imgs[$scope.selectedImgIndex]);
            } else {
                $scope.showFull();
                $ionicNavBarDelegate.showBar(false);
                screen.unlockOrientation();
                $scope.setImageOrientation();
                $ionicSlideBoxDelegate.$getByHandle('fullscreen-scroll').update();
                $ionicSlideBoxDelegate.$getByHandle('fullscreen-scroll').slide($scope.selectedImgIndex, 0);
            }
        }

        $scope.detailSlideHasChanged = function(index) {
            console.log('Detail Slide #: '+index);
            $scope.selectedImgIndex = index;
            //$scope.mainImageSwap($stateParams.itemId, $scope.selectedImgIndex,  $scope.art.imgs[$scope.selectedImgIndex]);
        }


        $scope.thumbPosition = function(index) {
            var pos = 0;
            var i;
            for (i = 0; i < index; i++) {
                pos += $("#image-thumb-" + i).width();
            }
            return pos;
        }

        // load thumbnail into main pic area
        $scope.mainImageSwap = function(artId,slideId,src) {

            //alert(artId + ' ' + slideId + ' ' + src);
            $scope.selectedImgIndex = slideId;
            
            //remove border from all, then apply to selected thumb
            $(".image-list-thumb").removeClass('thumbscroll-active');
            $("#image-thumb-" + slideId +"").addClass('thumbscroll-active');

            // change the main image
            document.getElementById('mainImage').style.backgroundImage = "url('" + src + "')";

            if ( !$scope.fullScreenMode && !$("#image-thumb-" + slideId).isOnScreen() ){
                $ionicScrollDelegate.$getByHandle('thumb-scroll').scrollTo($scope.thumbPosition(slideId), 0, true);
            }
        }

        // show multiple artists panel
        $scope.showMultipleArtists = function() {
            $('#multipleArtistsTitle').hide();
            $('#multipleArtistsContainer').show();
            $('#closeBtnMultipleArtists').show();
        }

        // close the multiple artists container
        $scope.hideMultipleArtists = function() {
            $('#multipleArtistsContainer').hide();
            $('#closeBtnMultipleArtists').hide();
            $('#multipleArtistsTitle').show();
        }


        // share modal
        $scope.openShareModal = function (evt) {
            $ionicModal.fromTemplateUrl('templates/modal/share.html', {
                scope: $scope,
                animation: 'slide-in-up'
            })
                .then(function(modal) {
                    $scope.shareModal = modal;
                    $scope.shareModal.show();
                });
            //SharingService.share({
            //text: 'testing share funct',
            //image: 'img/temp/os-gemeos/img1.jpg'
            //});
        }

        $scope.closeShareModal = function() {
            $scope.shareModal.hide();
        };


        $scope.shareFB = function() {
            //var msg = 'Check out street art by ' + ArtistsService.artistNames($scope.feed[$scope.currArtIdx].artists) + ' on Tagr!';
            var msg = 'Check out street art by ' + '??' + ' on Tagr!';
            cordova.plugins.clipboard.copy(msg);
            console.log('about to share: ' + $scope.imgs[$scope.selectedImgIndex]);
            SharingService.shareViaFaceBook(
                {
                    message: msg,
                    imageLink : $scope.imgs[$scope.selectedImgIndex]
                });
        }

        $scope.shareTwitter = function() {
            console.log('about to share: ' + $scope.feed[$scope.currArtIdx].imgs[$scope.selectedImgIndex]);
            SharingService.shareViaTwitter(
                {
                    message: 'Check out street art by ' + /*ArtistsService.artistNames($scope.feed[$scope.currArtIdx].artists)*/ '??' + ' on Tagr!',
                    imageLink : $scope.imgs[$scope.selectedImgIndex]
                });
        }

        $scope.loadMap = function() {


            console.log('long: ' + $scope.art.lat + ' lat: ' + $scope.art.lng)
            var artLatLng = new google.maps.LatLng($scope.art.lat,$scope.art.lng);

            var mapOptions = {
                center: artLatLng,
                zoom: 18,
                disableDefaultUI: true,
                draggable: false,
                zoomControl: false,
                scrollwheel: false,
                disableDoubleClickZoom: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            // debug to prove we have multipe el's with same id
            //$('#wrapper-' + $scope.art.id + ' div').each(function (i, el) {
            //    console.log($(el).attr("id"));
            //});

            // uid get's injected wrong in the view .. set it here for now??
            $('#wrapper-').attr("id","wrapper-"+$scope.art.uid);

            var mapEl = $('#wrapper-' + $scope.art.uid + ' #artmap');
            var map = new google.maps.Map($(mapEl)[0], mapOptions);
            var myLocation = new google.maps.Marker({
                map: map,
                position: artLatLng,
                icon: $scope.artOld.mapIcon // todo:
            });

            $scope.artmap = map;
            //google.maps.event.addDomListener(window, 'load', $scope.loadMap());

            google.maps.event.addListener(map, 'resize', function() {
                console.log("resize triggered");
                var x = map.getZoom();
                var c = map.getCenter();
                map.setZoom(x);
                map.setCenter(c);
            });
        }

        // tmp: need method(s) on art service
        $scope.nextItemIdx = function(curr) {
            console.log('currIdx: ' + curr + ' idAtCurr: ' +  $scope.feedNavigation[curr])
            if ( curr == $scope.feedNavigation.length-1 ) {
                return 0;
            }
            return ++curr;
        }

        $scope.previousItemIdx = function(curr) {
            console.log('currIdx: ' + curr + ' idAtCurr: ' +  $scope.feedNavigation[curr]);
            if ( curr == 0 ) {
                return $scope.feedNavigation.length-1;
            }
            return --curr;
        }


        $scope.onSwipeLeft = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $ionicViewSwitcher.nextDirection('forward');
            $scope.currArtIdx = $scope.nextItemIdx($scope.currArtIdx);
            $state.go("tab.feed-art", {itemId:$scope.feedNavigation[$scope.currArtIdx]});
        }

         $scope.onSwipeRight = function () {
             $ionicHistory.nextViewOptions({
                 disableBack: true
             });
             $ionicViewSwitcher.nextDirection('back');
             $scope.currArtIdx = $scope.previousItemIdx($scope.currArtIdx)
             $state.go("tab.feed-art", {itemId:$scope.feedNavigation[$scope.currArtIdx]});

        }

        // [view] lifecycle events

        $scope.$on( "$ionicView.enter", function( scopes, states ) {
            //google.maps.event.trigger($scope.artmap, 'resize' );
            //$scope.loadMap();
        });

        $scope.$on('$ionicView.unloaded', function(){
            console.log('*** Art Detail view "unloaded"');
            $scope.fullScreenMode = false;
        });

        $scope.backToRoot = function() {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
                disableBack: false,
                historyRoot: true
            });
            $state.go("tab.feed", {});
        }

        $scope.donateViaPaypal = function (amount,paypalEmail) {
            //ToDo: get paypal email from artist
            paypalEmail = "me%40tatianes%2ecom";
            var url = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business="+paypalEmail+"&lc=US&amount="+amount+"%2e00&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted";
            window.open(url,'_system'); // redirect user to default browser
        }

        $scope.canAcceptLoveBucks = function() {
            return true; //art.artist.extra_data.paypal_email
        }

});


    $.fn.isOnScreen = function(x, y){

        if(x == null || typeof x == 'undefined') x = 1;
        if(y == null || typeof y == 'undefined') y = 1;

        var win = $(window);

        var viewport = {
            top : win.scrollTop(),
            left : win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var height = this.outerHeight();
        var width = this.outerWidth();

        if(!width || !height){
            return false;
        }

        var bounds = this.offset();
        bounds.right = bounds.left + width;
        bounds.bottom = bounds.top + height;

        var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

        if(!visible){
            return false;
        }

        var deltas = {
            top : Math.min( 1, ( bounds.bottom - viewport.top ) / height),
            bottom : Math.min(1, ( viewport.bottom - bounds.top ) / height),
            left : Math.min(1, ( bounds.right - viewport.left ) / width),
            right : Math.min(1, ( viewport.right - bounds.left ) / width)
        };

        return (deltas.left * deltas.right) >= x && (deltas.top * deltas.bottom) >= y;

    };

