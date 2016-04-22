'use strict';

var inProduction = false;
angular.module('ParseModule', []).value('inProduction', inProduction);

if( inProduction ) {
  angular.module('ParseModule')
  .value('PARSE_APPLICATION_ID', '')
  .value('PARSE_JAVASCRIPT_KEY', '');
} else {
  angular.module('ParseModule')
  .value('PARSE_APPLICATION_ID', 'QAXhEGB80AVTm7o61xLWm9pj6BdFCB4vWsoRFvHF')
  .value('PARSE_JAVASCRIPT_KEY', 'o8e5hAHYN0hC5GVorrGL2GGh0ixEfvtjQNLaXNKJ');
}

angular.module('ParseModule')
.factory('Parse', 
	['PARSE_APPLICATION_ID', 'PARSE_JAVASCRIPT_KEY', function(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY) {
		Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
    	return Parse;
	}
]).run(['Parse', function(Parse) {
	// instantiates Parse
}]);