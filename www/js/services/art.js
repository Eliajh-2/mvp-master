'use strict';

angular.module('artscan.services')
.factory('ArtService', 
  ['TagrService',function(TagrService) {

    return {
      get: function(artId) {

        // for (var i = 0; i < feed.length; i++) {
        //   if (feed[i].uid === parseInt(artId)) {
        //     return feed[i];
        //   }
        // }
        // return null;


        TagrService.getArtworkbyId(artId)
        .success(function (response) {
            console.log('Response: '+JSON.stringify(response));

            return response.return;
        })
        .error(function (error, status, headers, config) {
            console.log('Error: '+JSON.stringify(error));
            console.log('Status: '+JSON.stringify(status));
            console.log('Headers: '+JSON.stringify(headers));
            console.log('Config: '+JSON.stringify(config));

            return null;
        });

      }
    };
}])
