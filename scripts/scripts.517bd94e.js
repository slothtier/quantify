"use strict";angular.module("quantifyApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngRoute","quantifyApp.main","quantifyApp.auth","quantifyApp.api","quantifyApp.authentication","quantifyApp.validation","quantifyApp.calculation","quantifyApp.scrolling","quantifyApp.displayduration","quantifyApp.errorhandling","quantifyApp.formatfilesize"]).run(["$rootScope","$location",function($rootScope,$location){$location.$$hash.search(/([A-Za-z0-9_-]{155,})/gi)>-1&&($rootScope.accessToken=$location.$$hash.match(/([A-Za-z0-9_-]{155,})/gi)[0],$location.path("/main"),$location.url($location.path()))}]).config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){$routeProvider.when("/main",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/auth",{templateUrl:"views/auth.html",controller:"AuthCtrl"}).otherwise({redirectTo:"/auth"}),$locationProvider.html5Mode(!0)}]),angular.module("quantifyApp.main",[]).controller("MainCtrl",["$scope","$http","$rootScope","url","playlistService","trackService","$q","size",function($scope,$http,$rootScope,url,playlistService,trackService,$q,size){$scope.quantify=function(){if(url.validate($scope.url)===!1)$scope.url="",$scope.showPlaylist=!1,$scope.errorMessage="",$scope.tmpUrl=$scope.url;else if($scope.url!=$scope.tmpUrl){$scope.tmpUrl=$scope.url,$scope.errorMessage="";var apiUrl="https://api.spotify.com/v1/users/"+url.validate($scope.url).user+"/playlists/"+url.validate($scope.url).playlist,authString="Bearer "+$rootScope.accessToken;playlistService.getPlaylist(apiUrl,authString).then(function(data){$scope.playlistName=data.name,$scope.playlistTrackcount=data.tracks.total;var apiUrlTracks=apiUrl+"/tracks",x=0,y=0,dataHelper=0,deferred=$q.defer(),reqPromises=[];for(x;x<data.tracks.total;)trackService.getTracks(apiUrlTracks,authString).then(function(data){dataHelper+=data,reqPromises.push(dataHelper),y+=1},function(error){$scope.errorMessage=error.error.status}).then(function(){var b=reqPromises.length;$scope.playlistDuration=reqPromises[b-1];var durationSec=reqPromises[b-1]/1e3;$scope.sizeNormalQualityIdeal=size.calculate(durationSec,"normal"),$scope.sizeHighQualityIdeal=size.calculate(durationSec,"high"),$scope.sizeExtremeQualityIdeal=size.calculate(durationSec,"extreme"),$scope.sizeNormalQualityReal=size.calculate(durationSec,"normal_real"),$scope.sizeHighQualityReal=size.calculate(durationSec,"high_real"),$scope.sizeExtremeQualityReal=size.calculate(durationSec,"extreme_real"),$scope.toggle=!0,$scope.toggleBitrate()}).then(function(){(reqPromises.length=y)&&$q.all(reqPromises).then(function(){deferred.resolve(),$scope.showPlaylist=!0})}),x+=100,apiUrlTracks=apiUrl+"/tracks?offset="+x;return deferred.promise},function(error){$scope.errorMessage=error.error.status,$scope.showPlaylist=!1})}},$scope.toggleBitrate=function(){$scope.toggle===!1?($scope.sizeNormalQuality=$scope.sizeNormalQualityReal,$scope.sizeHighQuality=$scope.sizeHighQualityReal,$scope.sizeExtremeQuality=$scope.sizeExtremeQualityReal,$scope.bitrateType="realistic",$scope.bitrateNormal="92",$scope.bitrateHigh="153",$scope.bitrateExtreme="281",$scope.toggle=!0):($scope.sizeNormalQuality=$scope.sizeNormalQualityIdeal,$scope.sizeHighQuality=$scope.sizeHighQualityIdeal,$scope.sizeExtremeQuality=$scope.sizeExtremeQualityIdeal,$scope.bitrateType="idealized",$scope.bitrateNormal="96",$scope.bitrateHigh="160",$scope.bitrateExtreme="320",$scope.toggle=!1)}}]),angular.module("quantifyApp.auth",[]).controller("AuthCtrl",["$scope","authService",function($scope,authService){$scope.authenticate=function(){window.location.href=authService.authenticate()}}]),angular.module("quantifyApp.api",[]).factory("playlistService",["$http","$q",function($http,$q){return{getPlaylist:function(apiUrl,authString){return $http({method:"GET",url:apiUrl,headers:{Authorization:authString}}).then(function(response){return response.data},function(response){return $q.reject(response.data)})}}}]).factory("trackService",["$http","$q",function($http,$q){return{getTracks:function(apiUrl,authString){return $http({method:"GET",url:apiUrl,headers:{Authorization:authString}}).then(function(response){var tracksHelper=[],tracksListHelper=[],durationMsHelper=0;angular.forEach(response.data.items,function(item){tracksHelper.push(item)});for(var i=0;i<Object.keys(tracksHelper).length;i++)tracksListHelper.push(tracksHelper[i].track);for(var j=0;j<Object.keys(tracksListHelper).length;j++)durationMsHelper+=tracksListHelper[j].duration_ms;return durationMsHelper},function(response){return $q.reject(response.data)})}}}]),angular.module("quantifyApp.authentication",[]).factory("authService",function(){var buildUrl=function(){var accountUrl="https://accounts.spotify.com/authorize",clientID="client_id=2877dc4791af41e0b53de799f8cf2472",redirectUri="redirect_uri=https%3A%2F%2Fslothtier.github.io%2Fquantify%2Findex.html",authScope="scope=playlist-read-private",responseType="response_type=token",state="state=123";return accountUrl+"?"+clientID+"&"+redirectUri+"&"+authScope+"&"+responseType+"&"+state};return{authenticate:function(){return buildUrl()}}}),angular.module("quantifyApp.validation",[]).factory("url",function(){var validateUrl=function(url){if(url.search("http://open.spotify.com/user/")>-1&&url.search(/[\w]{22}/gi)>-1&&url.search("/playlist/")>-1){url=url.replace("http://open.spotify.com/user/","");var urlHelper=url.split("/");return{user:urlHelper[0],playlist:urlHelper[2]}}if(url.search("spotify:user:")>-1&&url.search(/[\w]{22}$/gi)>-1&&url.search(":playlist:")>-1){url=url.replace("spotify:user:","");var urlHelper=url.split(":");return{user:urlHelper[0],playlist:urlHelper[2]}}return!1};return{validate:function(url){return validateUrl(url)}}}),angular.module("quantifyApp.calculation",[]).factory("size",function(){var getSize=function(duration,quality){switch(quality){case"normal":duration=12*duration/1e3;break;case"high":duration=20*duration/1e3;break;case"extreme":duration=40*duration/1e3;break;case"normal_real":duration=11.5*duration/1e3;break;case"high_real":duration=19.2*duration/1e3;break;case"extreme_real":duration=35.1*duration/1e3}return duration};return{calculate:function(duration,quality){return getSize(duration,quality)}}}),angular.module("quantifyApp.scrolling",[]).directive("scrollOnClick",function(){return{restrict:"A",scope:{scrollTo:"@"},link:function(scope,$elm){$elm.on("click",function(){$("html,body").animate({scrollTop:$(scope.scrollTo).offset().top},"slow")})}}}).directive("scrollOnSubmit",function(){return{restrict:"A",scope:{scrollTo:"@"},link:function(scope,$elm){$elm.on("submit",function(){$("html,body").animate({scrollTop:$(scope.scrollTo).offset().top},"slow")})}}}),angular.module("quantifyApp.displayduration",[]).filter("displayduration",function(){return function(input){var seconds=parseInt(input/1e3%60),minutes=parseInt(input/6e4%60),hours=parseInt(input/36e5);return hours=10>hours?"0"+hours:hours,minutes=10>minutes?"0"+minutes:minutes,seconds=10>seconds?"0"+seconds:seconds,hours+" hr "+minutes+" min "+seconds+" sec"}}),angular.module("quantifyApp.formatfilesize",[]).filter("formatunit",function(){return function(input){return 1e3>=input?"~ "+Math.round(input)+" MB":"~ "+(input/1e3).toFixed(2)+" GB"}}),angular.module("quantifyApp.errorhandling",[]).filter("apiError",function(){return function(input){var errorMessage="";switch(input){case"":errorMessage="";break;case void 0:errorMessage="";break;case 401:errorMessage='~ your access token has expired, please <a href="#">re-authenticate</a> ~';break;case 404:errorMessage="~ playlist could not be found ~";break;case 429:errorMessage="~ too many requests, please try again later ~";break;case 503:errorMessage="~ the Spotify API appears to experience technical difficulties currently ~";break;default:errorMessage="~ uh oh.. something went horribly wrong ~"}return errorMessage}}).filter("validationError",function(){return function(){return"enter a valid spotify playlist url or uri"}});