angular.module('quicksmite.todo', []);

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

angular.module('quicksmite.summonerInfo', []);
// Code here will be linted with JSHint.
/* jshint ignore:start */
angular
    .module('quicksmite.summonerInfo', ['mm.foundation'])
    .config(function($routeProvider) {
        $routeProvider.when('summonerInfo/:name', {
            templateUrl: 'summonerInfo/summonerInfo.html',
            controller: 'sumInfoCtrl'
        });
    })
    .controller('sumInfoCtrl', function($scope, $route, TodoService, sumInfoService) {

        TodoService.getSummonerName($route.current.params.name).then(function(response) {
            $scope.summonerDatas = response.data;
            console.log('data 2 is: ', $scope.summonerDatas);
            //console.log('id is: ', $scope.summonerDatas['handsomehansen'].id);
            var result = Object.keys($scope.summonerDatas);
            $scope.result = result[0];
            console.log('result is :' + $scope.result);
            $scope.profileId = sumInfoService.getProfileId($scope.summonerDatas[$scope.result].profileIconId);
            /*            sumInfoService.getPastGameInfo($scope.summonerDatas[$scope.result].id).then(function(response) {
                         $scope.pastGameInfos = response.data['matches'];
                         console.log($scope.pastGameInfos[0]);
                        });*/

        });

        /*        sumInfoService.getChampions().then(function(response) {
                    $scope.championDatas = response.data;
                    console.log($scope.championDatas)
                });*/
        /*        sumInfoService.getPastGameInfo().then(function(response) {
                    $scope.pastGameInfos = response.data;
                    console.log($scope.pastGameInfos);
                });*/

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

        function loadChampionData(callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', '/resources/champion.json', true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = function() {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        }

        loadJSON(function(response) {
            // Parse JSON string into object
            $scope.pastGameInfos = JSON.parse(response);
            console.log($scope.pastGameInfos);
            $scope.pastGameInfos = $scope.pastGameInfos['matches'][1];
            $scope.secondDataSet = $scope.pastGameInfos;

            $scope.participantData = $scope.secondDataSet.participants[0];
            console.log($scope.participantData);

            loadChampionData(function(response) {
                $scope.championData = JSON.parse(response);
                //console.log($scope.championData.data);

                for (var champion in $scope.championData.data) {
                    for (key in $scope.championData.data[champion]) {
                        if ($scope.championData.data[champion].hasOwnProperty(key)) {
                            //console.log(key + " key is " + $scope.championData.data[champion][key]);
                            if ((key =='key') && ($scope.championData.data[champion][key] == $scope.participantData.championId)) {
                                $scope.champion = sumInfoService.getChampionSquare(champion);
                                console.log("found a match" + $scope.champion);
                            }
                        }
                    }
                }
            });

            loadJSON2(function(response) {
                // Parse JSON string into object
                $scope.spellIds = JSON.parse(response);
                //console.log($scope.spellIds.data);

                for (var spells in $scope.spellIds.data) {
                    //console.log($scope.spellIds.data[spells]);
                    for (key in $scope.spellIds.data[spells]) {
                        if ($scope.spellIds.data[spells].hasOwnProperty(key)) {
                            // console.log(key + " key is " + $scope.spellIds.data[spells][key]);
                            if ((key == 'key') && ($scope.spellIds.data[spells][key] == $scope.participantData.spell1Id)) {
                                $scope.spell1 = sumInfoService.getSpell1Id(spells);
                                console.log("found a match" + $scope.spell1);
                            }
                        }
                    }
                }

                for (var spells2 in $scope.spellIds.data) {
                    //console.log($scope.spellIds.data[spells2]);
                    for (key in $scope.spellIds.data[spells2]) {
                        if ($scope.spellIds.data[spells2].hasOwnProperty(key)) {
                            // console.log(key + " key is " + $scope.spellIds.data[spells][key]);
                            if ((key == 'key') && ($scope.spellIds.data[spells2][key] == $scope.participantData.spell2Id)) {
                                console.log("found a match" + spells2);
                                $scope.spell2 = sumInfoService.getSpell2Id(spells2);
                            }
                        }
                    }
                }
            });
        });

        function loadJSON2(callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', '/resources/summoner.json', true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = function() {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        }






        // for (var i in $scope.pastGameInfos) {
        //     if (i == 'participantIdentities' || i == 'participants') {
        //         delete $scope.pastGameInfos[i];
        //     }
        // }

    })
    .factory('sumInfoService', function($http, $q) {
        return {
            getProfileId: function(profileId) {
                var img = $("<img />").attr('src', 'http://ddragon.leagueoflegends.com/cdn/5.3.1/img/profileicon/' + profileId + '.png')
                    .load(function() {
                        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                            alert('broken image!');
                        } else {
                            $("#something").append(img);
                        }
                    });
            },
            getSpell1Id: function(spellId) {
                var img2 = $("<img />").attr('src', 'http://ddragon.leagueoflegends.com/cdn/5.2.1/img/spell/' + spellId + '.png')
                    .load(function() {
                        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                            alert('broken image!');
                        } else {
                            $("#spells").append(img2);
                        }
                    });
            },
            getSpell2Id: function(spellId) {
                var img2 = $("<img />").attr('src', 'http://ddragon.leagueoflegends.com/cdn/5.2.1/img/spell/' + spellId + '.png')
                    .load(function() {
                        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                            alert('broken image!');
                        } else {
                            $("#spells2").append(img2);
                        }
                    });
            },
            getChampionSquare: function(championId) {
                    var img = $("<img />").attr('src', 'http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/' + championId + '.png')
                        .load(function() {
                            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                                alert('broken image!');
                            } else {
                                $("#championSquare").append(img);
                            }
                        });
                }
                /*            getPastGameInfo: function() {
                                        var defer = $q.defer();
                                        $http.get('/#/website/matchhistory.json').then(function(response) {
                                            defer.resolve(response);
                                        });
                                        return defer.promise;
                            }*/
                //     getChampions: function() {
                //         var defer = $q.defer();
                //         $http.get('http://ddragon.leagueoflegends.com/cdn/5.2.1/data/en_US/champion.json').then(function(response) {
                //             defer.resolve(response);
                //         });
                //         return defer.promise;
                //     },
                //     getPastGameInfo: function(summonerId) {
                //         var defer = $q.defer();
                //         $http.get('https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/' + summonerId + '?api_key=7bb1997f-8ae8-47a6-ac69-5adf2ea7129e').then(function(response) {
                //             defer.resolve(response);
                //         });
                //         return defer.promise;
                //     }
        }
    });
//$route.current.params.name
// Code here will be ignored by JSHint.
/* jshint ignore:end */



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

(function(module) {
try {
  module = angular.module('quicksmite');
} catch (e) {
  module = angular.module('quicksmite', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/quicksmite/summonerInfo/summonerInfo.html',
    '<body><top-bar><ul class="title-area"><li class="name"><h1><a href="#/todo">My Site</a></h1></li><li toggle-top-bar class="menu-icon"><a href="#">Menu</a></li></ul><top-bar-section><ul class="right"><li class="active"><a href="#">Active</a></li><li has-dropdown><a href="#">Dropdown</a><ul top-bar-dropdown><li><a href="#">First link in dropdown</a></li></ul></li></ul><ul class="left"><li><a href="#">Left</a></li></ul></top-bar-section></top-bar><table class="large-6 columns large-offset-3"><thead><tr><th width="200">Summoner ID</th><th width="200">Summoner Name</th><th width="200">Profile Icon</th><th width="200">Summoner Level</th></tr></thead><tbody><tr><td>{{summonerDatas[result].id}}</td><td>{{summonerDatas[result].name}}</td><td><div id="something"></div></td><td>{{summonerDatas[result].summonerLevel}}</td></tr></tbody></table><br><table class="large-6 columns large-offset-3"><thead><tr><th width="200">Champion ID</th><th width="200">Rank</th><th width="200">Spell 1</th><th width="200">Spell 2</th></tr></thead><tbody><tr><td><div id="championSquare"></div></td><td>{{participantData.highestAchievedSeasonTier}}</td><td><div id="spells"></div></td><td><div id="spells2"></div></td></tr></tbody></table></body>');
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
