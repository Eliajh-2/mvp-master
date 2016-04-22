'use strict';

angular.module('artscan.services')
.factory('ModalService', ['$ionicModal', '$rootScope', '$scope', '$q', function($ionicModal, $rootScope, $scope, $q) {
 
	var init = function(tpl, $scope) {

	    var promise;
	    $scope = $scope || $rootScope.$new();
	    
	    promise = $ionicModal.fromTemplateUrl(tpl, {
	      scope: $scope,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.modal = modal;
	      return modal;
	    });

	    $scope.openModal = function() {
	       $scope.modal.show();
	     };
	     $scope.closeModal = function() {
	       $scope.modal.hide();
	     };
	     $scope.$on('$destroy', function() {
	       $scope.modal.remove();
	     });
	    
	    return promise;
	  }
	  
	  return {
	    init: init
	  }

}])