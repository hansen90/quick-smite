angular.module('quicksmite', [
        'ngRoute',
        'quicksmite.todo',
        'quicksmite.summonerInfo',
        'quicksmite.gameInfo',
        'mm.foundation'
    ])
    .config(function($routeProvider) {
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
            .when('/gameInfo', {
                controller: 'gameInfoCtrl',
                templateUrl: '/quicksmite/gameInfo/gameInfo.html'
            })
            .otherwise({
                redirectTo: '/todo'
            });
    });
