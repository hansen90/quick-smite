// Code here will be linted with JSHint.
/* jshint ignore:start */
angular
    .module('quicksmite.todo', ['mm.foundation'])
    .controller('TodoCtrl', function($scope, $window, $http, $location, TodoService) {
        'use strict';
        $scope.todos = JSON.parse($window.localStorage.getItem('todos') || '[]');
        $scope.$watch('todos', function(newTodos, oldTodos) {
            if (newTodos !== oldTodos) {
                $window.localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
            }
        }, true);

        $scope.add = function() {
            var todo = {
                label: $scope.label,
                isDone: false
            };
            $scope.todos.push(todo);
            $window.localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
            $scope.label = '';
        };

        $scope.check = function() {
            this.todo.isDone = !this.todo.isDone;
        };

        $scope.singleModel = 1;

        $scope.radioModel = 'Middle';

        $scope.checkModel = {
            left: false,
            middle: true,
            right: false
        };

        $scope.formData = {};

        /*        $scope.submitSummoner = function() {
                    TodoService.getSummonerName($scope.formData.summonerName).then(function(response) {
                        $scope.summonerData = response.data;
                        console.log('data is: ', $scope.summonerData);
                    });
                };*/
        $scope.goNext = function() {
            $location.path('/summonerInfo/'+$scope.formData.summonerName);
        }

    })
    .factory('TodoService', function($http, $q) {
        return {
            getSummonerName: function(summonerName) {
                /*                $http({
                                    url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + summonerName + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e',
                                    method: 'GET'
                                }).success(function(data, status, headers, config) {
                                    $scope.data = data;
                                    console.log($scope.data);
                                }).error(function(data, status, headers, config) {
                                    $scope.status = status;
                                    console.log($scope.status);
                                });*/

                var defer = $q.defer();
                $http.get('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + summonerName + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e').then(function(response) {
                    defer.resolve(response);
                });

                return defer.promise;
            }
        }
    });
//{"handsomehansen":{"id":22898654,"name":"HandsomeHansen","profileIconId":759,"summonerLevel":30,"revisionDate":1424670711000}}
// Code here will be ignored by JSHint.
/* jshint ignore:end */
