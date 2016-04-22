'use strict';

angular.module('artscan.services')
.factory('VideoService', 
  [function() {

    // get art data
    //var art = getSyncDataService.getData('data/feed.json');

    return {
      all: function() {
        return video;
      }, 
      get: function(video, videoId) {
        for (var i = 0; i < video.length; i++) {
          if (video[i].id === parseInt(videoId)) {
            return video[i];
          }
        }
        return null;
      }
    };
}])