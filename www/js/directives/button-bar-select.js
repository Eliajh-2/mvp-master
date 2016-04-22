'use strict';

angular.module('artscan.directives')
.directive('barSelect',function($parse){
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=barSelect'
    },
    link: function(scope, element, attrs, ngModelCtrl){
      element.addClass('button');
      element.on('click', function(e){
        scope.$apply(function(){
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal){
        element.removeClass('active');
        if (newVal === scope.value){
          element.addClass('active');
        }
      });
    }
  };
});