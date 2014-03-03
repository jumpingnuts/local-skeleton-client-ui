'use strict';
    //모듈 선언
var app = angular.module(
  'nutsApp', [
    'mainCtrls',
    'userCtrls',
    'mainServices',
    'userServices',
    'nativeServices',
    'directives',
    'filters',
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ui.bootstrap'
  ]);
  
app.config(function($routeProvider){
  $routeProvider
    .when('/list/:type', {
      //template: '<div></div>',
      controller : 'ListCtrl',
      templateUrl : './views/list.html'
    })
    .when('/app/:contentId', {
      //template: '<div></div>',
      controller : 'ViewCtrl',
      resolve : {
        content :
          function(ContentLoader) {
            return new ContentLoader();
          }
      },
      templateUrl : './views/view.html'
    })
    .when('/write', {
      controller : 'WriteCtrl',
      templateUrl : './views/write.html'
    })
    .when('/login', {
      controller : 'LoginCtrl',
      templateUrl : './views/signin.html'
    })
    .when('/regist', {
      controller : 'RegistCtrl',
      templateUrl : './views/regist.html'
    })
    .otherwise({redirectTo:'/list/trends'});
})
.config(function($httpProvider){
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
});

//    app.config();

//공통 컨트롤러 설정 - 모든 컨트롤러에서 공통적으로 사용하는 부분들 선언
app.controller('CommonController', [
  '$rootScope',
  '$scope',
  '$location',
  function($rootScope, $scope, $location) {
    $scope.contents = {
      type: 'trends',
      data: [],
      lastEvaluatedKey: null,
      scrollPos: 0
    };
    
    var appname = 'greennuts';
    $scope.appInfo = $rootScope.appInfo = {
      'appname': appname,
      'title': '영어의신',
      'webUrl': 'http://nut.gy/'+appname,
      'mailto': 'mailto:nuts@jumpingnuts.com',
      'company': 'Jumping Nuts Inc.',
      'establishmentYear': '2013',
      'api' : {
        'baseUrl': 'http://api.jumpingnuts.com',  //상용
//        'baseUrl': 'http://0.0.0.0:9000/dummy/?url=', //개발
        'clientId': '0441c0011f37fec037843fcfe314366f',
        'responseType': 'token',
        'openType': 'iframe'//iframe, opener
      },
      'android': {
        'appId': 'com.jumpingnuts.'+appname,
        'url' : 'https://play.google.com/store/apps/details?id='+'com.jumpingnuts.'+appname,
        'urlCustom' : 'market://details?id='+'com.jumpingnuts.'+appname
      }
    };

    $scope.nav = {
      'active': 'trends',
      'items': {
        'trends': {'name':'트랜드', 'order':1},
        'best': {'name': '베스트', 'order':2},
        'new': {'name': '새 글', 'order':3},
        'mine': {'name': '내가 올린 사연', 'hide':true, 'order':4}
      },
    };
    
    /*
    $scope.nav = {
      'active': 'play',
      'items': {
        'play': {'name':'시작하기', 'order':1},
        'help': {'name': '도움말', 'order':2},
        'rank': {'name': '랭킹보기', 'order':3},
      },
    };
    */
    $scope.$on('$routeChangeStart', function(){
      if($scope.appInfo.currentPath !== $location.path()) {
        $scope.contents.data = [];
        $scope.contents.lastEvaluatedKey = null;
      }
      $scope.appInfo.currentUrl=$location.absUrl();
      $scope.appInfo.currentPath=$location.path();
      $scope.alerts = [];
      $scope.nav.navCollapsed = true;
    });
    
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    
    $scope.loadScroll = function() {
      $(window).scrollTop($scope.contents.scrollPos);
    };
    $scope.saveScrollMove = function(url, $event) {
      $scope.contents.scrollPos = $(window).scrollTop();
      $scope.move(url, $event);
    };
    $scope.move = function (url, $event) {
      if($event) { $scope.eventStop($event); }
      $location.url( url );
    };
    
    $scope.eventStop = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
    };
  }
]);

app.controller('NativeCtrl', ['$scope', 'NativeFunc', 'Login', function($scope, NativeFunc, Login){
  if(!window.android){ return false; }
  window.android.loginCallback = $scope.loginCallback = function(res){
    if(JSON.parse(res).response === '200') {
      $scope.userInfo.connection.push('kakao');
      $scope.userConnection.kakao = JSON.parse(window.android.getUserInfo());
      NativeFunc.notiRegist($scope.userConnection.kakao.username, $scope.appInfo.android.url);

      if($scope.userConnection.kakao.properties.uid && $scope.userConnection.kakao.properties.key) {
        var opt = {
          'connectionProvider': 'kakao',
          'connectionKey': $scope.userConnection.kakao.properties.key
        };
        new Login($scope.userConnection.kakao.properties.uid, opt).then(function(res){
          if(res.id) {
            $scope.setUserInfo(res);
          }
        });
      }
    }

  };
  //getUserInfo
  //setUserInfo
  //uploadStoryPost
}]);
