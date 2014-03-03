'use strict';

describe('Controller: MainCtrl', function(){
  var scope;//we'll use this scope in our tests

  //mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('mainCtrls'));
  //mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller){
    //create an empty scope
    scope = $rootScope.$new();
    //declare the controller and inject our empty scope
    $controller('CommonController', {$scope: scope});
  }));
  // tests start here
  console.log(2);
  it('appname = "enggod"', function(){
    expect(scope.appInfo.appname).toBe('enggod');
  });
});