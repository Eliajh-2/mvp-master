'use strict';

angular.module('artscan.services')
.factory('TagrService', 
  ['localstorage','$http', function(localstorage,$http) {

  // apis documentation can be found here: https://auth.tagr.in/help


  // TODO: move information below to a config file
  var apiBaseURL = 'http://auth.tagr.in/api';
  var key = 'jRUJgK32KPR45';
  var app_key = '44jfiaAsdD';

  //var requiredKeys = {key:key,app_key:app_key};

    function postURL (api_specific,dataObj) {
        var url = apiBaseURL + api_specific;
        console.log('API URL: '+url);

        var data = {};
        data = {key:key,app_key:app_key};
        angular.forEach(dataObj,function(value,key) {
            data[key] = value;
        });
        //console.log('All data: '+JSON.stringify(data));

        return $http({
                  url: url,
                  method: 'POST',
                  data: data,
                  headers: {'Content-Type':'application/json'},
                });
    }

    function getURL (api_specific,need_keys) {
        var url = apiBaseURL + api_specific;
        console.log('API URL: '+url);
        if(need_keys) {
            url += '&'+'key='+key+'&'+'app_key='+app_key;
        }
        return $http.get(url);
    }

    return {
        login: function (dataObj) {
            return postURL('/init-user/login/',dataObj);
        },
        createUser: function (dataObj) {
            return postURL('/init-user/create/',dataObj);
        },
        deleteUser: function (dataObj) {
            return postURL('/init-user/delete/',dataObj);
        },
        editUser: function (dataObj) {
            return postURL('/init-user/edit/',dataObj);
        },
        followUser: function (dataObj) {
            return postURL('/init-user/follow/',dataObj);
        },
        getUser: function (dataObj) {
            return postURL('/init-user/get/',dataObj);
        },
        getArtist: function (uid) {
            var attributes = '';
            if(!angular.isUndefined(uid)) attributes += 'uid='+uid+'&';
            return getURL('/tagr/artist/get/?'+attributes,true);
        },
        getArtistArtwork: function (uid) {
            var attributes = '';
            if(!angular.isUndefined(uid)) attributes += 'artist_id='+uid+'&';
            return getURL('/tagr/asset/search/?'+attributes,true);
        },
        getFeed: function (limit,last_item_id) {
            var attributes = '';
            if(!angular.isUndefined(limit)) attributes += 'limit='+limit+'&';
            if(!angular.isUndefined(last_item_id)) attributes += 'last_item_id='+last_item_id;
            return getURL('/feed/home/?'+attributes,false);
        },
        getArtworkbyId: function (uid) {
            var attributes = '';
            if(!angular.isUndefined(uid)) attributes += 'uid='+uid+'&';
            return getURL('/tagr/asset/get/?'+attributes,true);
        },
        faveArtwork: function (asset_id,ukey) {
            var attributes = '';
            if(!angular.isUndefined(asset_id)) attributes += 'asset_id='+asset_id+'&';
            if(!angular.isUndefined(ukey)) attributes += 'ukey='+ukey;
            return getURL('/tagr/asset/like/?'+attributes,true);
        },
        unfaveArtwork: function (asset_id,ukey) {
            var attributes = '';
            if(!angular.isUndefined(asset_id)) attributes += 'asset_id='+asset_id+'&';
            if(!angular.isUndefined(ukey)) attributes += 'ukey='+ukey;
            return getURL('/tagr/asset/unlike/?'+attributes,true);        
        }
    };

}])