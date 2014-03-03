'use strict';

angular.module('mainCtrls', ['ngSanitize', 'ngMd5', 'mainServices', 'nativeServices', 'commentCtrls'])
  .controller('MainCtrl', ['$scope', function ($scope) {
    
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }])
  .controller('ListCtrl', [
    '$scope',
    '$routeParams',
    '$timeout',
    'MultiContentLoader',
    'Content',
    function($scope, $routeParams, $timeout, MultiContentLoader, Content) {
      $scope.isLoad = false;
      
      if($scope.contents.type !== $routeParams.type) {
        $scope.contents.data = [];
        $scope.contents.lastEvaluatedKey = null;
      } else {
        $timeout(function(){
          $scope.loadScroll();
        }, 0);
      }
      
      $scope.contents.type = $scope.nav.active = $routeParams.type;

      if($scope.contents.type==='mine' && !$scope.isLogin()) {
        $scope.moveLogin();
        return false;
      }

      $scope.listLoad = function(){
        if($scope.isLoad) {return false;}
        $scope.isLoad = true;
        new MultiContentLoader($scope.contents.lastEvaluatedKey, $scope.contents.type, $scope.userInfo.id).then(function(res){
          if(res.data.length > 0) {
            $scope.contents.data = $scope.contents.data.concat(res.data);
            if(res.LastEvaluatedKey) {
              $scope.contents.lastEvaluatedKey = res.LastEvaluatedKey?res.LastEvaluatedKey:null;
              $scope.isLoad = false;
            }
          }
        });
      };
      $scope.listLoad();
      
      $scope.deleteContent = function($event){
        $scope.eventStop($event);
        if(confirm('삭제 하시겠습니까?')) {
          var contentId = $($event.currentTarget).attr('data-id');
          new Content.remove({ id:contentId }, function(res){
            if(res.id) {
              for(var i in $scope.contents.data) {
                if($scope.contents.data[i].id === res.id) {
                  $scope.contents.data.pop(i);
                  break;
                }
              }
            }
          });
        }
      };
    }
  ])
  
  .controller('ViewCtrl', [
    '$scope',
    '$route',
    '$routeParams',
    'md5',
    'Content',
    'content',
    'ShareFunc',
    'NativeFunc',
    function($scope, $route, $routeParams, md5, Content, content, ShareFunc, NativeFunc){
      if(!content.id) { $scope.move('/list/trends'); }
      $scope.result = '';
      $scope.like = {
        'light' : false,
        'text' : {false: '꺼짐', true: '켜짐'}
      };
      $scope.content = content;
      $scope.like.light = content.liked ? content.liked : false;
      
      $scope.likeToggle = function(){
        if(!$scope.isLogin()) {
          $scope.moveLogin();
          return false;
        }

        if($scope.like.light) {
          new Content.delete({'id':$scope.content.id, 'action':'like'}, function(res){
            if(res) {
              $scope.like.light = false;
              $scope.content.vote_count--;
            }
          });
        } else {
          new Content.save({'id':$scope.content.id, 'action':'like'}, function(res){
            if(res) {
              $scope.like.light = true;
              $scope.content.vote_count++;

              if(window.android){
                var data = {
                  'appName': $scope.appInfo.title,
                  'content': $(('<b>'+$scope.content.content+'</b>').replace(/<br[\s]?[\/]?\>/gi, '\n').trim()).text(),
                  'title': $scope.userConnection.kakao.username+'님이 '+$scope.content.title+' 사연을 좋아합니다.',
                  'marketUrl': $scope.appInfo.android.url,
                  'currentUrl': $scope.appInfo.currentUrl,
                  'appId': $scope.appInfo.android.appId
                };
                data.storyPostText = ShareFunc.postText(data);
                
                NativeFunc.uploadStroryPost(data, $scope.content.thumb, '앱으로 가기', $scope.appInfo.currentPath, '');
              }
            }
          });
        }
      };
    }
  ])
  .controller('WriteCtrl', ['$scope', 'ContentSave', function($scope, ContentSave){
    $scope.write = {
      'user_id': $scope.userInfo.id,
      'title': '',
      'content': '',
      'is_anonymous': false
    };
    
    $scope.contentSave = function(){
      new ContentSave($scope.write).then(function(res){
        if(res.id) {
          $scope.contents.data = [];
          $scope.contents.lastEvaluatedKey = null;
          $scope.move('/app/'+res.id);
        }
      });
    };
  }])
  
  .controller('ShareCtrl', ['$scope', 'ShareFunc', function($scope, ShareFunc){
    $scope.shareLink = function(type){
      var data = {
        'appName': $scope.appInfo.title,
        'content': $(('<b>'+($scope.content.content ? $scope.content.content : '')+'</b>').replace(/<br[\s]?[\/]?\>/gi, '\n').trim()).text(),
        'currentImage': '',
        'currentUrl': $scope.appInfo.currentUrl,
        'title': $scope.content.title,
        'marketUrl': $scope.appInfo.android.url,
        'appId': $scope.appInfo.android.appId
      };

      ShareFunc[type](data);
    };
  }]);
