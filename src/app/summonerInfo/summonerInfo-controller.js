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
            console.log('responseForToDo', response);
            $scope.summonerDatas = response.data;
            console.log('data 2 is: ', $scope.summonerDatas);
            //console.log('id is: ', $scope.summonerDatas['handsomehansen'].id);
            $scope.result = Object.keys($scope.summonerDatas)[0];
            console.log($scope.result);
            $scope.profileId = sumInfoService.getProfileId($scope.summonerDatas[$scope.result].profileIconId);

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

        loadJSON(function(response) {
            $scope.pastGameInfos = JSON.parse(response).matches;
        });

    })
    .factory('sumInfoService', function($http, $q) {
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
