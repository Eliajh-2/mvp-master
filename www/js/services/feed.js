'use strict';

angular.module('artscan.services')
.factory('FeedService', 
  ['getSyncDataService', function(getSyncDataService) {

  // get feed data
  var feed = getSyncDataService.getData('data/feed.json');

  return {
    all: function() {
      return feed;
    }
  };
}])
