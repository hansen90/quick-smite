// Code here will be linted with JSHint.
/* jshint ignore:start */
angular
    .module('quicksmite.gameInfo', ['mm.foundation'])
    .config(function($routeProvider) {
        $routeProvider.when('gameInfo', {
            templateUrl: 'gameInfo/gameInfo.html',
            controller: 'gameInfoCtrl'
        });
    })
    .controller('gameInfoCtrl', function($scope, $route, TodoService, gameInfoService) {

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

    })
    .factory('gameInfoService', function($http, $q) {
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
    });
//$route.current.params.name
// Code here will be ignored by JSHint.
/* jshint ignore:end */
