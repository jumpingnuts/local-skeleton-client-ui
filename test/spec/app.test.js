'use strict';

describe('Controller: CommonController', function(){
  var scope;//we'll use this scope in our tests
  //mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('nutsApp'));
  //mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller){
    //create an empty scope
    scope = $rootScope.$new();
    //declare the controller and inject our empty scope
    $controller('CommonController', {$scope: scope});
  }));
  // tests start here
  
  it('appname = "greennuts"', function(){
    expect(scope.appInfo.appname).toBe('greennuts');
  });
});