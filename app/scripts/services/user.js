'use strict';

angular.module('userServices', [ 'ngResource'])
  .factory('Login', [ '$rootScope', '$resource', '$q', function($rootScope, $resource, $q) {
    return function(email, otp) {
      var Login = $resource($rootScope.appInfo.api.baseUrl+'/login');
      var param = {
        'email': email
      };
      if(otp.connectionProvider) {
        param.connectionProvider = otp.connectionProvider;
        param.connectionKey = otp.connectionKey;
      } else {
        param.password = otp.password;
      }
      
      var delay = $q.defer();
      new Login.save(param, function(res, code) {
        delay.resolve(res, code);
      }, function(res) {
        delay.reject(res);
      });
      return delay.promise;
    };
  }])
  
  .factory('Logout', [ '$rootScope', '$resource', function($rootScope, $resource) {
    return $resource($rootScope.appInfo.api.baseUrl+'/logout');
  }])
  
  .factory('User', [ '$rootScope', '$resource', function($rootScope, $resource) {
    return $resource($rootScope.appInfo.api.baseUrl+'/users/:id/:action', {'id':'@id', 'action':'@action'});
  }])
  
  .factory('UserRegist', [ 'User', '$q', function(User, $q) {
    return function(data) {
      var delay = $q.defer();
      new User.save(data, function(res) {
        delay.resolve(res);
      }, function(res) {
        delay.reject(res);
      });
      return delay.promise;
    };
  }]);