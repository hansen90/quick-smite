angular.module('quicksmite.todo', []);

// Code here will be linted with JSHint.
/* jshint ignore:start */
angular
    .module('quicksmite.todo', ['mm.foundation'])
    .controller('TodoCtrl', ["$scope", "$window", "$http", "$location", "TodoService", function($scope, $window, $http, $location, TodoService) {
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

    }])
    .factory('TodoService', ["$http", "$q", function($http, $q) {
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
    }]);
//{"handsomehansen":{"id":22898654,"name":"HandsomeHansen","profileIconId":759,"summonerLevel":30,"revisionDate":1424670711000}}
// Code here will be ignored by JSHint.
/* jshint ignore:end */

angular.module('quicksmite.summonerInfo', []);
// Code here will be linted with JSHint.
/* jshint ignore:start */
angular
    .module('quicksmite.summonerInfo', ['mm.foundation'])
    .config(["$routeProvider", function($routeProvider) {
        $routeProvider.when('summonerInfo/:name', {
            templateUrl: 'summonerInfo/summonerInfo.html',
            controller: 'sumInfoCtrl'
        });
    }])
    .controller('sumInfoCtrl', ["$scope", "$route", "TodoService", "sumInfoService", function($scope, $route, TodoService, sumInfoService) {

        TodoService.getSummonerName($route.current.params.name).then(function(response) {
            $scope.summonerDatas = response.data;
            console.log('data 2 is: ', $scope.summonerDatas);
            //console.log('id is: ', $scope.summonerDatas['handsomehansen'].id);
            $scope.result = Object.keys($scope.summonerDatas)[0];
            //console.log($scope.result.profileIconId);
            $scope.profileId = $scope.summonerDatas[$scope.result].profileIconId;
            console.log($scope.profileId);
        });

        function loadJSON(callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', '/resources/matchhistory.json', true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = function() {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        }

        function removeDup(arr) {
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                obj[arr[i]] = true;
            }
            return Object.keys(obj);
        }


        loadJSON(function(response) {
            $scope.pastGameInfos = JSON.parse(response).matches;
            $scope.champion = null;
            $scope.championList = [];
            $scope.championId = [];
            $scope.championNameList = [];
            $scope.spell1NameList = [];
            $scope.spell2NameList = {};

            $scope.spell1Id = [];
            $scope.spell2Id = [];
            console.log($scope.pastGameInfos);
            for (var i = 0; i < $scope.pastGameInfos.length; i++) {
                $scope.championList.push($scope.pastGameInfos[i]["matchMode"]);
                $scope.championId.push($scope.pastGameInfos[i].participants[0]["championId"]);
                $scope.spell1Id.push($scope.pastGameInfos[i].participants[0]["spell1Id"]);
                $scope.spell2Id.push($scope.pastGameInfos[i].participants[0]["spell2Id"]);
            }
            console.log($scope.championList);
            console.log($scope.championId);
            console.log($scope.spell1Id);
            console.log($scope.spell2Id);

            console.log(removeDup($scope.spell1Id));
            console.log(removeDup($scope.spell2Id));
            console.log(removeDup($scope.championId));
            $scope.noDupChampionId = removeDup($scope.championId);
            $scope.noDupSpell1Id = removeDup($scope.spell1Id);
            $scope.noDupSpell2Id = removeDup($scope.spell2Id);


            for (var i = 0; i < $scope.noDupChampionId.length; i++) {
                sumInfoService.getChampionName($scope.noDupChampionId[i]).then(function(response) {
                    $scope.championNames = response.data;
                    //console.log($scope.championNames);
                    $scope.championNameList.push($scope.championNames.name);
                });
            }

            for (var i = 0; i < $scope.noDupSpell1Id.length; i++) {
                sumInfoService.getSummonerSpellName($scope.noDupSpell1Id[i]).then(function(response) {
                    $scope.spell1Names = response.data;
                    //console.log($scope.championNames);
                    $scope.spell1NameList.push($scope.spell1Names.key);
                });
            }

            for (var i = 0; i < $scope.noDupSpell2Id.length; i++) {
                sumInfoService.getSummonerSpellName2($scope.noDupSpell2Id[i]).then(function(response) {
                    $scope.spell2Names = response.data;
                    //console.log($scope.championNames);
                    //$scope.spell2NameList.push($scope.spell2Names.key);
                    $scope.spell2NameList[$scope.noDupSpell2Id[0]] = $scope.spell2Names.key;
                    console.log(JSON.stringify($scope.spell2NameList));
                });
            }

            //console.log($scope.championNameList);

            /*            var championNameList = [];
                        $scope.championNames = null;
                        $scope.participantRank = null;
                        console.log($scope.pastGameInfos);
                        for (var i = 0; i < $scope.pastGameInfos.length; i++) {
                            $scope.champion = $scope.pastGameInfos[i].participants[0].championId;
                            //console.log($scope.champion);
                            $scope.participantRank = $scope.pastGameInfos[i].participants[0].highestAchievedSeasonTier;


                            sumInfoService.getChampionName($scope.champion).then(function(response) {
                                $scope.championNames = response.data;
                                console.log($scope.championNames.name);
                                //$scope.championNames = $scope.championNames.name;
                                championNameList.push($scope.championNames.name);

                            });
                            championList.push($scope.champion);
                        }
                        console.log('array of champion ids', championList);
                        console.log('array of champion names', championNameList);*/


        });

    }])
    .factory('sumInfoService', ["$http", "$q", function($http, $q) {
        return {
            /*            getProfileId: function(profileIconId) {
                            var defer = $q.defer();
                            $http.get('http://ddragon.leagueoflegends.com/cdn/5.2.1/img/profileicon/' + profileIconId + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e').then(function(response) {
                                defer.resolve(response);
                            });

                            return defer.promise;
                        },*/
            getChampionName: function(championId) {
                var defer = $q.defer();
                $http.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + championId + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e').then(function(response) {
                    defer.resolve(response);
                });

                return defer.promise;
            },
            getSummonerSpellName: function(spellId) {
                var defer = $q.defer();
                $http.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/summoner-spell/' + spellId + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e').then(function(response) {
                    defer.resolve(response);
                });

                return defer.promise;
            },
            getSummonerSpellName2: function(spellId) {
                var defer = $q.defer();
                $http.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/summoner-spell/' + spellId + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e').then(function(response) {
                    defer.resolve(response);
                });

                return defer.promise;
            }
        }
    }]);
//$route.current.params.name
// Code here will be ignored by JSHint.
/* jshint ignore:end */



angular.module('quicksmite.gameInfo', []);
// Code here will be linted with JSHint.
/* jshint ignore:start */
angular
    .module('quicksmite.gameInfo', ['mm.foundation'])
    .config(["$routeProvider", function($routeProvider) {
        $routeProvider.when('gameInfo', {
            templateUrl: 'gameInfo/gameInfo.html',
            controller: 'gameInfoCtrl'
        });
    }])
    .controller('gameInfoCtrl', ["$scope", "$route", "TodoService", "gameInfoService", function($scope, $route, TodoService, gameInfoService) {

        function loadJSON(callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', '/resources/matchhistory.json', true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = function() {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        }

        loadJSON(function(response) {
            $scope.pastGameInfos = JSON.parse(response).matches;
            $scope.championList = [];
            $scope.championId = [];
            $scope.kills = [];
            $scope.assists = [];
            $scope.deaths = [];
            $scope.championLevel = [];
            $scope.largestMultiKill = [];

            console.log($scope.pastGameInfos);
            for (var i = 0; i < $scope.pastGameInfos.length; i++) {
                $scope.championList.push($scope.pastGameInfos[i]["matchMode"]);
                $scope.championLevel.push($scope.pastGameInfos[i].participants[0]["stats"].champLevel);
                $scope.kills.push($scope.pastGameInfos[i].participants[0]["stats"].kills);
                $scope.assists.push($scope.pastGameInfos[i].participants[0]["stats"].assists);
            }
            console.log($scope.championList);
            console.log($scope.championLevel);
            console.log($scope.kills);
            console.log($scope.assists);

        });

    }])
    .factory('gameInfoService', ["$http", "$q", function($http, $q) {
        return {
            getChampionName: function(championId) {
                var defer = $q.defer();
                $http.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + championId + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e').then(function(response) {
                    defer.resolve(response);
                });

                return defer.promise;
            },
            getSummonerSpellName: function(spellId) {
                var defer = $q.defer();
                $http.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/summoner-spell/' + spellId + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e').then(function(response) {
                    defer.resolve(response);
                });

                return defer.promise;
            },
            getSummonerSpellName2: function(spellId) {
                var defer = $q.defer();
                $http.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/summoner-spell/' + spellId + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e').then(function(response) {
                    defer.resolve(response);
                });

                return defer.promise;
            }
        }
    }]);
//$route.current.params.name
// Code here will be ignored by JSHint.
/* jshint ignore:end */

angular.module('quicksmite', [
        'ngRoute',
        'quicksmite.todo',
        'quicksmite.summonerInfo',
        'quicksmite.gameInfo',
        'mm.foundation'
    ])
    .config(["$routeProvider", function($routeProvider) {
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
    }]);

(function(module) {
try {
  module = angular.module('quicksmite');
} catch (e) {
  module = angular.module('quicksmite', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/quicksmite/gameInfo/gameInfo.html',
    '<body><top-bar><ul class="title-area"><li class="name"><h1><a href="#/todo">My Site</a></h1></li><li toggle-top-bar class="menu-icon"><a href="#">Menu</a></li></ul><top-bar-section><ul class="right"><li class="active"><a href="#">Active</a></li><li has-dropdown><a href="#">Dropdown</a><ul top-bar-dropdown><li><a href="#">First link in dropdown</a></li></ul></li></ul><ul class="left"><li><a href="#">Left</a></li></ul></top-bar-section></top-bar><table class="responsive-summoner" ng-repeat="pastGameInfo in pastGameInfos track by $index" class="large-6 large-centered column"><thead><tr><th width="200">Champion Level</th><th width="200">Kills</th><th width="200">Assists</th></tr></thead><tbody><tr><td ng-bind="championLevel[$index]"></td><td ng-bind="kills[$index]"></td><td ng-bind="assists[$index]"></td></tr></tbody></table></body>');
}]);
})();

(function(module) {
try {
  module = angular.module('quicksmite');
} catch (e) {
  module = angular.module('quicksmite', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/quicksmite/summonerInfo/summonerInfo.html',
    '<body><top-bar><ul class="title-area"><li class="name"><h1><a href="#/todo">My Site</a></h1></li><li toggle-top-bar class="menu-icon"><a href="#">Menu</a></li></ul><top-bar-section><ul class="right"><li class="active"><a href="#">Active</a></li><li has-dropdown><a href="#">Dropdown</a><ul top-bar-dropdown><li><a href="#">First link in dropdown</a></li></ul></li></ul><ul class="left"><li><a href="#">Left</a></li></ul></top-bar-section></top-bar><table class="large-6 large-centered column"><thead><tr><th width="200">Summoner ID</th><th width="200">Summoner Name</th><th width="200">Profile Icon</th><th width="200">Summoner Level</th></tr></thead><tbody><tr><td>{{summonerDatas[result].id}}</td><td>{{summonerDatas[result].name}}</td><td><img ng-src="http://ddragon.leagueoflegends.com/cdn/5.2.1/img/profileicon/{{profileId}}.png"></td><td>{{summonerDatas[result].summonerLevel}}</td></tr></tbody></table><table class="responsive-summoner" ng-repeat="pastGameInfo in pastGameInfos track by $index" class="large-6 large-centered column"><thead><tr><th width="200">Game Details</th><th width="200">Game Mode</th><th width="200">Champion ID</th><th width="200">Champion Photo</th><th width="200">Spell 1</th><th width="200">Spell 2</th></tr></thead><tbody><tr><td><a href="gameInfo/gameInfo.html">Game Summary<td></td><td ng-bind="championList[$index]"></td><td ng-bind="championId[$index]"></td><td><img ng-src="http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/{{championNameList[$index]}}.png"></td><td><img ng-src="http://ddragon.leagueoflegends.com/cdn/5.2.1/img/spell/{{spell1NameList[$index]}}.png"></td><td><img ng-src="http://ddragon.leagueoflegends.com/cdn/5.2.1/img/spell/{{spell2NameList[$index].value}}.png"></td></a></td></tr></tbody></table></body>');
}]);
})();

(function(module) {
try {
  module = angular.module('quicksmite');
} catch (e) {
  module = angular.module('quicksmite', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/quicksmite/todo/todo.html',
    '<body><top-bar><ul class="title-area"><li class="name"><h1><a href="#/todo">QuickSmite</a></h1></li><li toggle-top-bar class="menu-icon"><a href="#">Menu</a></li></ul><top-bar-section><ul class="right"><li class="active"><a href="#">Active</a></li><li has-dropdown><a href="#">Dropdown</a><ul top-bar-dropdown><li><a href="#">First link in dropdown</a></li></ul></li></ul></top-bar-section></top-bar><br><br><br><br><div class="row"><div class="large-6 columns large-offset-3"><div class="row collapse prefix-round"><div class="small-3 columns"><button ng-click="goNext()" class="button prefix">Go</button></div><div class="small-9 columns"><input placeholder="Enter Summoner Name" name="summonerName" ng-model="formData.summonerName"></div></div></div></div><br><pre>\n' +
    '      {{formData}}\n' +
    '    </pre></body>');
}]);
})();
