'use strict';

angular.module('mainServices', [ 'ngResource' ])
  .factory('Content', [ '$rootScope', '$resource', function($rootScope, $resource) {
    return $resource($rootScope.appInfo.api.baseUrl+'/'+$rootScope.appInfo.appname+'/articles/:id/:action',
      {'id':'@id', 'action':'@action'}
    );
  }])
  .factory('MultiContentLoader', [ 'Content', '$q', function(Content, $q) {
    return function(lastEvaluatedKey, order, userId) {
      order = order?order:'trends';
      var limit = 20;

      var param = {
        'limit':limit,
        'order':order
      };
      
      if(lastEvaluatedKey) {
        param.LastEvaluatedKey = angular.toJson(lastEvaluatedKey);
      }

      if(order==='mine' && userId) {
        param.author = userId;
      }
      
      var delay = $q.defer();
      Content.get(param, function(res) {
        delay.resolve(res);
      }, function(res) {
        delay.reject(res);
      });
      return delay.promise;
    };
  }])
  .factory('ContentLoader', [ 'Content', '$route', '$q', function(Content, $route, $q) {
    return function() {
      var delay = $q.defer();
      Content.get({ id : $route.current.params.contentId }, function(res) {
        delay.resolve(res);
      }, function(res) {
        delay.reject(res);
      });
      return delay.promise;
    };
  }])
  
  .factory('ContentSave', [ 'Content', '$q', function(Content, $q) {
    return function(data) {
      var delay = $q.defer();
      Content.save(data, function(res) {
        delay.resolve(res);
      }, function(res) {
        delay.reject(res);
      });
      return delay.promise;
    };
  }])

  .factory('ShareFunc', function(){
    return {
      kakaoTalk: function(data){
        kakao.link('talk').send({
          msg : data.title+'\n\n'+data.content+'\n\n'+data.currentUrl+'\n\n',
          url : data.marketUrl,
          appid : data.appId,
          appver : '1.0',
          appname : data.appName,
          type : 'link'
        });
      },
      
      kakaoStory: function(data){
        kakao.link('story').send({
          post : '['+data.appName+'] '+data.title+'\n\n'+data.content+'\n\n'+data.currentUrl+'\n\n안드로이드 : '+data.marketUrl,
          appid : data.appId,
          appver : '1.0',
          appname : data.appName,
          urlinfo : JSON.stringify({
            title: data.title,
            desc: data.content.substring(0,80)+'...',
            imageurl:[data.currentImage],
            type:'app'
          })
        });
      },

      twitter: function(data){
        window.location.href = 'https://twitter.com/intent/tweet?'+
          'original_referer='+encodeURIComponent(data.currentUrl)+
          '&text='+encodeURIComponent('['+data.appName+'] '+data.title+'\n'+data.content.replace(/\n/gi, ' ').substring(0,60))+'\n\n'+
          '&url='+encodeURIComponent(data.marketUrl);
      },

      facebook: function(data){
        window.location.href = 'http://www.facebook.com/sharer.php?m2w&s=100'+
          '&p[url]='+encodeURIComponent(data.marketUrl)+
          '&p[images][0]='+encodeURIComponent(data.currentImage)+
          '&p[title]='+data.title+
          '&p[summary]='+data.content;
      },
      
      postText : function(data){
        return '['+data.appName+'] '+data.title+'\n\n'+data.content+'\n\n안드로이드 : '+data.marketUrl;
      }
    };
  });