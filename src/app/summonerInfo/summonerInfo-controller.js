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

            $scope.kills = [];
            $scope.assists = [];
            $scope.deaths = [];
            $scope.championLevel = [];
            $scope.largestMultiKill = [];
            $scope.KDA = [];

            $scope.spell1Id = [];
            $scope.spell2Id = [];
            console.log($scope.pastGameInfos);
            for (var i = 0; i < $scope.pastGameInfos.length; i++) {
                $scope.championList.push($scope.pastGameInfos[i]["matchMode"]);
                $scope.championId.push($scope.pastGameInfos[i].participants[0]["championId"]);
                $scope.spell1Id.push($scope.pastGameInfos[i].participants[0]["spell1Id"]);
                $scope.spell2Id.push($scope.pastGameInfos[i].participants[0]["spell2Id"]);

                $scope.championLevel.push($scope.pastGameInfos[i].participants[0]["stats"].champLevel);
                $scope.kills.push($scope.pastGameInfos[i].participants[0]["stats"].kills);
                $scope.assists.push($scope.pastGameInfos[i].participants[0]["stats"].assists);
                $scope.deaths.push($scope.pastGameInfos[i].participants[0]["stats"].deaths);
                $scope.KDA.push(($scope.kills[i] + $scope.assists[i]) / $scope.deaths[i]);
            }
            console.log($scope.KDA);
            console.log($scope.championLevel);
            console.log($scope.kills);
            console.log($scope.assists);
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

    })
    .factory('sumInfoService', function($http, $q) {
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
    });
//$route.current.params.name
// Code here will be ignored by JSHint.
/* jshint ignore:end */
