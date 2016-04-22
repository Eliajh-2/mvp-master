'use strict';

angular.module('artscan.services')
.factory('FavoriteService', 
  ['localstorage', function(localstorage) {

    // TODO: for performance issues, set the initial favorite as an empty object
    // so it doesn't check everytime if the object exists
    if(localstorage.getObject('favorite') === null) {
      localstorage.setObject('favorite',{});
    }

    var favorites = localstorage.getObject('favorite');
    console.log('Favorites: '+JSON.stringify(favorites));

    return {
      getFavoritesPerType: function (type) {
        if(angular.isUndefined(favorites[type]) || favorites[type] === null) {
          return null;
        } else {
          return favorites[type];
        }
      },
      isFavorite: function(type,id) {
        var allPerType = favorites[type];
        if(angular.isUndefined(allPerType) || allPerType === null) {
            return false;
        } else {
          for (var i = 0; i < allPerType.length; i++) {
            if (allPerType[i] === parseInt(id)) {
              return true;
            }
          }
        }
        return false;
      }, 
      add: function(type,id,artistId) {
        if(angular.isUndefined(artistId)) {
          console.log('artistId not defined');
        } 
        if(angular.isUndefined(favorites[type]) || favorites[type] === null) {
          favorites[type] = [];
        } 
        favorites[type].push(id);
        localstorage.setObject('favorite',favorites);
        return true;
      }, 
      remove: function(type,id,artistId) {
        if(angular.isUndefined(artistId)) {
          console.log('artistId not defined');
        } 
        for (var i = 0; i < favorites[type].length; i++) {
          if (favorites[type][i] === parseInt(id)) {
            favorites[type].splice(i, 1);
            localstorage.setObject('favorite',favorites);
            return true;
          }
        }        
      }
    };
}])