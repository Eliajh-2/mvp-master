'use strict';

angular.module('artscan.controllers')
    .controller('FeedCtrl', function($scope,$ionicScrollDelegate,$ionicHistory,$timeout,$state,PromoService,TagrService) {

        // load promo content
        $scope.promo = PromoService.all();

        $scope.cntr = 0;
        $scope.isActive;

        // load more items to feed
        $scope.feedGetMoreItems = function () {

            var limit = 18;

            TagrService.getFeed(limit,$scope.lastFeedItem)
            .success(function (response) {

                angular.forEach(response.return.results,function(value) {
                    $scope.feed.push(value);
                    $scope.feedNavigation.push(value.uid); 
                });

                $scope.lastFeedItem = response.last_item_id;
                if($scope.lastFeedItem != '') {
                    $scope.moreFeedItems = true;
                } else {
                    $scope.moreFeedItems = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');

            })
            .error(function (error, status, headers, config) {
                // TODO: display message to user
                console.log('Error: '  +JSON.stringify(error));
                console.log('Status: ' +JSON.stringify(status));
                console.log('Headers: '+JSON.stringify(headers));
                console.log('Config: ' +JSON.stringify(config));

            });
        }


        $scope.doFeedRefresh = function() {
            //TODO: add the logic to refresh feed

            $scope.$broadcast('scroll.refreshComplete');
        }


        var now = new Date().getTime();
        $scope.scrollHandler = function() {
            //console.log($ionicScrollDelegate.$getByHandle('myScroll').scrollTop());
            return;
            //if (new Date().getTime() - now > 1000) {
            now = new Date().getTime();
            $(".row").children('div').each(function (i, el) {
                var el = $(el);
                if (el.visible(true)) {
                    setTimeout(function () {
                        el.addClass('gridAnim');
                    }, 10);

                } else {
                    el.removeClass('gridAnim');
                    //el.addClass("already-visible");
                }
            });

            //}
        }

        $scope.promoToDetailView = function (artid) {
            var id = artid;

            // highlight banner
            $('#promo').addClass("promoTap");

            // dim thumbnails
            $(".row").css("opacity", ".3");

            // go to detail view after delay
            $timeout(function() {
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go("tab.feed-art", {itemId:id});
            }, 350);

            // setup delay to reset styling
            $timeout(function() {
                $('#promo').removeClass("promoTap");
                $(".row").css("opacity", "1");
            }, 1500);
        }

        $scope.toDetailView = function (path, obj) {
            var id = obj.currentTarget.attributes.id.value;
            // highlight selection
            $('#' + id).addClass("feedTap");

            // also grey out the promot banner
            var el = document.getElementById("promo");
            el.style.opacity=0.3;

            // dim non-selected
            $(".row").children('div').each(function (i, el) {
                var el = $(el);
                if ( el.attr("id") != id) {
                    if (el.visible(true)) {
                        el.css("opacity", ".3");
                    }
                }
            });

            // go to detail view after delay
            $timeout(function() {
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                console.log('Go to tab.feed-art: '+id);
                $state.go("tab.feed-art", {itemId:id});
            }, 350);

            // setup delay to reset styling
            $timeout(function() {
                $('#' + id).removeClass("feedTap");
                $(".row").children('div').each(function (i, el) {
                    var el = $(el);
                    el.css("opacity", "1");
                });
                // also reset the promo banner
                var el = document.getElementById("promo");
                el.style.opacity=1;
            }, 1500);
        }


    })



/**
 * Copyright 2012, Digital Fusion
 * Licensed under the MIT license.
 * http://teamdf.com/jquery-plugins/license/
 *
 * @author Sam Sehnert
 * @desc A small plugin that checks whether elements are within
 *     the user visible viewport of a web browser.
 *     only accounts for vertical position, not horizontal.
 */

$.fn.visible = function(partial) {

    var $t            = $(this),
        $w            = $(window),
        viewTop       = $w.scrollTop(),
        viewBottom    = viewTop + $w.height(),
        _top          = $t.offset().top,
        _bottom       = _top + $t.height(),
        compareTop    = partial === true ? _bottom : _top,
        compareBottom = partial === true ? _top : _bottom;

    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

};

//// Already visible modules
//$(".row").children('div').each(function(i, el) {
//    var el = $(el);
//    if (el.visible(true)) {
//        el.addClass("already-visible");
//    }
//});
