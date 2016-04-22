'use strict';

angular.module('artscan.services')
.factory('DialogService', 
	['$ionicModal', '$timeout', '$rootScope',
	function($ionicModal, $timeout, $rootScope) {
		return {
			open: function(msg, opts) {
				var template	= (opts && opts.template)  || 'templates/modal/default.html';
				var animation 	= (opts && opts.animation) || 'slide-in-up';
				var closeTime 	= (opts && opts.closeTime) || 2000;
				var scope		= (opts && opts.scope)	   || $rootScope;
				scope.title 	= (opts && opts.title)     || '';
				scope.msg	 	= msg;

				return $ionicModal.fromTemplateUrl(template, {
					scope: scope,
					animation: animation 
				}).then(
					function(modal) {
						modal.show();
						$timeout(function() {
							modal.remove();
						}, closeTime);
				});
			},
			success: function(msg, opts) {
				return this.open(msg, opts);
			},
			error: function(msg, opts) {
				if(!opts) {
					opts = {};
				}
				opts.title		 = (opts && opts.title) || 'Error';
				opts.template	= 'templates/modal/error.html';
				return this.open(msg, opts);
			}
		};
	}
])
