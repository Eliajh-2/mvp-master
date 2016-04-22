'use strict';

angular.module('artscan.services')
.factory('SharingService', 
	[function() {
		return {
			share: function(opts) {
        window.plugins.socialsharing.share(
            opts.text, 
            opts.subject,
            opts.image, 
            opts.link
            )
			},

            shareViaFaceBook: function(opts) {
                  //window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Message via Facebook', null /* img */, null /* url */, 'Paste it dude!',
                   window.plugins.socialsharing.shareVia('com.apple.social.facebook', opts.message, '', '', opts.imageLink,
                    function(){
                        console.log('Facebook post successful!')
                    }, function(msg) {
                        console.log('Facebook post ' + msg)
                    })
            },

            shareViaTwitter: function(opts) {
                window.plugins.socialsharing.shareVia('com.apple.social.twitter', opts.message, null, null, opts.imageLink,
                    function(){
                        console.log('Twitter post successful!')
                    }, function(msg) {
                        console.log('Twitter post: ' + msg)
                    })
            }

		};
	}
]);
