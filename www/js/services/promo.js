'use strict';

angular.module('artscan.services')
.factory('PromoService', 
  [function() {

  // Some fake testing data
  var promo = [{
    id: 1,
    src: "img/banners/promo1.jpg",
    link: "#/tab/feed/art/44",
    artid: 44 
  }, {
    id: 2,
    src: "img/banners/promo2.jpg",
    link: "#/tab/feed/art/51",
    artid: 51
  },{
    id: 3,
    src: "img/banners/promo3.jpg",
    link: "#/tab/feed/art/13",
    artid: 13
  }, {
    id: 4,
    src: "img/banners/promo4.jpg",
    link: "#/tab/feed/art/1",
    artid: 1
  }];

  return {
    all: function() {
      return promo;
    }
  };

}])
