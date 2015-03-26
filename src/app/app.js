
angular.module('quicksmite', [
  'ngRoute',
  'quicksmite.todo',
  'quicksmite.summonerInfo',
  'mm.foundation'
])
.config(function ($routeProvider) {
  'use strict';
  $routeProvider
    .when('/todo', {
      controller: 'TodoCtrl',
      templateUrl: '/quicksmite/todo/todo.html'
    })
    .when('/summonerInfo/:name', {
      controller: 'sumInfoCtrl',
      templateUrl: '/quicksmite/summonerInfo/summonerInfo.html'
    })
    .otherwise({
      redirectTo: '/todo'
    });
});
