'use strict';

angular.module('artscan.services')
.factory('ArtistsService', 
  ['TagrService',function(TagrService) {

    // get art data
    //var artists = getSyncDataService.getData('data/feed.json');

  return {
    
    all: function() {
      return artists;
    },

    // return a string with artist name(s), e.g., name1, name2 & name3
    artistNames: function(artists) {
      var names = '';
      angular.forEach(artists, function(artist){
        //console.log(artist.name);
        names += artist.name + ', ';
      })

      names = names.replace(/,\s*(\w+),\s*$/, " & $1")  // Done! Case for any more than 1 -> xxx, yyy,
      names = names.replace(/,\s*$/, "")  // Done! Case for only 1 appear -> xxx, (won't interfere with the case 1)

      return names;
    }
  };
}])
