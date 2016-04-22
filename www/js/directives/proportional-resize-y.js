'use strict';

angular.module('artscan.directives')
.directive('proportionalResizeY', ['$interval',
	function($interval) {
		return {

			link: function(scope, element) {
				$(element).hide();

				function resize() {
					var hasTabs = ($('.tabs-item-hide').length <= 0);

					var targetHeight = window.screen.height;
					if (hasTabs) {
						targetHeight -= $('.tab-nav.tabs').outerHeight();
					}

					var imgHeight = $(element).height();
					var ratio = 0;

					$interval.cancel(intervalRef);

					$(element).css('height', imgHeight * ratio);

					if (imgHeight * ratio < targetHeight) {
						ratio = targetHeight / imgHeight;
						$(element).css('height', imgHeight * ratio);
					}

					$(element).show();
				}

				var intervalRef = $interval(resize, 500);
			}

		}
	}
]);