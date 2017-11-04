// /**
//  * Created by Christina on 2016-12-08.
//  */
// var app = angular.module('myApp', ['restangular', 'ui.router']);
//
// app.controller('game2Ctrl', function($scope, Restangular, $state) {
//     $scope.end = 0; //0 = not ended, 1 = end state for guest, 2 = end state for registered user
//
//     // signing up
//     $scope.user = {username: null, password: null, email: null};
//     $scope.taken = false; // username is taken
//
//     /// initialization code and global variables //////////
//     $scope.score = 0;
//     $scope.target = 0;
//
//     // size of elements
//     var dim = 50;
//
//     // hospital model
//     var models = {
//         0 : [
//             [149,59,63,57,157,44,36,161,18,162],
//             [91,9,75],
//             [126,108,128,83],
//             [93,108,143,128,57,40],
//             [82,92,83,2,142,25,156,120,144,157,136,128],
//             [127,13,75,148],
//             [33,162,18,75,40],
//             [151,132,113,134],
//             [96,17,145,22,101,57,92,156,83,75,40,44,136],
//             [24,140,4,18],
//             [6,77,160],
//             [66,59,157,63,46,44,83,161,113],
//             [152,17,62,22,101,57,125,83],
//             [90,140,4,35,88,153,136,63,57,128,36],
//             [135,57,113],
//             [67,59,157,113,128,46,44,83,50,18],
//             [55,108,46,106,162,57,136,40],
//             [111,128,36,46,136,57],
//             [14,136,128],
//             [97,133,94,85,78,10,108,46],
//             [58,13,75,148],
//             [100,77,75,148],
//             [39,59,108,113,18,83,46],
//             [110,41,108,94,78,10],
//             [1,84,108,75,148,160,40,57,136,50],
//             [34,157,128,44]
//         ],
//         1:  [
//             [149,59,157],
//             [91],
//             [126],
//             [47,148,75,36,88,37],
//             [33],
//             [151,134],
//             [139,157,123],
//             [61,143,123],
//             [96,17,53,36],
//             [80,141,46,118],
//             [138],
//             [24,3,37,83],
//             [6,77,160,162,40],
//             [66,59],
//             [152,17,42],
//             [74,141,106],
//             [90,57,88,128],
//             [67,59,113,157],
//             [115],
//             [55,143],
//             [97,123,85,94],
//             [23],
//             [100,77,75,148],
//             [39,59,113,134],
//             [110,123,94],
//             [1,156],
//             [1,160,148,75,40,136,57],
//             [56,83,119],
//             [34,46,123]
//         ],
//         2:  [
//             [149,59,108,18,162,83,63,131,44,78],
//             [91,9,75,148,157],
//             [126,71,145,22,10,15,128],
//             [93,10,143,15,128],
//             [68,18,3,83,162,44,131],
//             [82,145,22,136,128,57],
//             [147,86,157,53,42,118,57],
//             [127,75,148,3,157,162,18,78],
//             [33,113,140,128,148,75,40,83],
//             [151,132,134],
//             [139,4,35,88,78,157],
//             [61,4,140,78,143],
//             [96,17,36,118,53],
//             [80,8,101,92,57],
//             [138,28,12,5,76,85,27],
//             [24,4,140,83,37,18,78],
//             [6,77,162,160],
//             [66,59,113,63,157,150,44],
//             [152,17,113,42],
//             [74,8,101,92,57,156],
//             [90,153,85,75,10,57,136,88,92,131],
//             [45,86],
//             [19,4,35,88,79,128,44,15],
//             [154,86,87,99],
//             [67,59,113,63,157,53,42,92],
//             [115,86,43,109,3,42],
//             [55,86,71,128,15,143,108,118],
//             [111,145,22,128,15,136],
//             [97,4,113,108,94,85,157,10,78],
//             [58,75,148,10,37,36,143,128,88],
//             [23,10,15,40],
//             [100,77,148,75],
//             [39,59,108,113,3],
//             [110,4,73,113,108,94,85,10,78],
//             [1,4,108,148,75,57,40,136,118,106],
//             [89,136],
//             [56,8,113,83,92,128,150,119],
//             [34,78,46]
//         ],
//         3:  [
//             [21,131],
//             [149,59,18],
//             [93,128,83,3],
//             [33,4,140,71,3],
//             [121,83,131,136,57],
//             [61,140,4,143],
//             [96,17],
//             [24,37,3],
//             [6,77,148],
//             [66,59,113,153],
//             [152,17],
//             [90,4,32,131,36,57],
//             [19,4,31,32,79,157,35,156,153,29,118],
//             [67,59,157,113,153],
//             [115,43,32,109,131],
//             [55,108,22,51,38,4,143,18,153],
//             [97,4,133,148],
//             [23,143,108,18,40],
//             [100,77,113],
//             [39,59,3],
//             [110,4,140,73,108,134,75],
//             [146,131],
//             [1,4,84,94,136,57],
//             [56,113,38,131],
//             [34,131]
//         ],
//         4:	[
//             [149,59,63],
//             [93,143],
//             [82,136,128,57],
//             [33,40,7],
//             [151,132,134],
//             [49,113,143],
//             [96,112],
//             [24,116,18],
//             [6,77,160],
//             [66,59,113,63],
//             [152,112],
//             [90,57],
//             [64,98],
//             [67,59,63,113,157],
//             [30,17],
//             [97],
//             [65,98,108],
//             [100,77],
//             [39,59,113,108],
//             [110],
//             [155,17],
//             [1,136,57,40,75,148]
//         ],
//
//         5:  [
//             [149,59,131,83,118,46,106],
//             [93],
//             [33,148],
//             [96,145,22,57,125,101,118,83,128,131],
//             [24,140,4,18,158],
//             [159,83],
//             [6,77,18,148],
//             [66,59,113,83],
//             [152,101,145,22,156,125,131,128,83],
//             [19,4,137,35,57,69,128,83,46,106],
//             [104,131],
//             [129,143],
//             [67,59,113,131,83],
//             [55,145,22,143,71,131,4,136,131,57,40,128,106,46,148,130],
//             [39,59,113,3,83],
//             [110,108,52,16,113,83,134],
//             [1,148,118],
//             [56,57,92,122,83,119,113,128,46]
//         ],
//         6:  [
//             [149,59,18,83,3,44,131,15],
//             [91,140],
//             [126],
//             [93,143,15],
//             [68],
//             [147,73,57,153,118],
//             [127,78,75,148],
//             [33,16,113,40],
//             [151,132,113],
//             [139,4,35,137,78],
//             [121,44,92,156,83,15],
//             [61,4,140,143,78],
//             [96,17,53],
//             [80,8,92],
//             [138,20,117,26,54,75,148,85,32],
//             [72,136,118],
//             [24,4,140,37,78,18],
//             [6,77,160,162],
//             [66,59,113,83,157,153,156,105,57,128],
//             [152,17,42],
//             [74,8,92,156],
//             [74,8,92,156],
//             [90,88,36,153,131,113],
//             [19,4,35,88,79,103,53,118,15],
//             [67,59,153,83,156,92,113,157,118],
//             [115,43,109,3,48,57,153,136],
//             [55,73,57,40,136,128,108,153,118],
//             [111,145,22,101,128,15],
//             [97,133,94,85],
//             [58,10,37,36,88],
//             [23,15],
//             [100,77],
//             [39,59,162,83,108,3,113],
//             [110,16,73,85],
//             [1,84,75,160,148,108,40,57,157,136],
//             [56,20,117,26,54,32,57,113,156,105,92,119],
//             [34,70,114,78,131]
//         ],
//         7:  [
//             [149,59,18,83],
//             [91,9],
//             [126,22,51],
//             [93,128,143],
//             [147,73,83,156,36,144,136,57],
//             [127,13],
//             [33,4,83],
//             [151,10,78],
//             [96,17,102,118],
//             [138,20,117,26,54],
//             [72,36,156],
//             [24,4,140,95,18],
//             [6,77,162],
//             [66,59,113,156,92],
//             [152,17,102,92],
//             [90,4,88,36,131],
//             [19,36,4,35,88,153,118,128],
//             [67,59,92,113],
//             [115,43,109,3,136],
//             [55,143,36,73,128,108,143],         //   [55,143,36,73,128,108,143],
//             [97,133,85,78,10],
//             [58,13],
//             [100,77],
//             [39,59,113],
//             [110,124,73,75,10,78],
//             [1,4,148,160],
//             [56,105,119,83]
//         ]
//     };
//
//     $scope.models = models;
//     $scope.fake = true; // fake rounds
//     var tut = false; // two tutorial rounds -- trying to teach players are necessary info: i.e. that scores must temp
//     // decrease at times
//
//     // names of each model
//     $scope.modelNames = [0, 1, 2, 3, 4, 5, 6, 7];
//
//
//     $scope.selectedElements = [];
//
//     /// initial solution
//     var initialGroups = [];
//     var seedType = null;
//     var prevSeeds = [];
//     // var contributions = initCont();
//     var startTime = (new Date()).getTime();
//     var initialScore = 0;
//
//     // load images of all 162 properties and add then
//     // to variable images
//     $scope.numLoaded = 0;
//     var images = [];
//     var tutSeed;
//
//     // store seed element
//     $scope.seed = {
//         model: null,
//         pos: null,
//         truepos: null
//     };
//
//     $scope.leeway = 1.0;
//
//     $scope.suggestions = {suggestionList: [], counter: 0};
//
//     getPrevSolution();
//     ///// end of initialization code and variables /////////
//
//     //////////////// FUNCTIONS FOR GAME INIT ////////////
//     function saveAttempt() {
//         Restangular.all('/save_attempt').post({
//             initialScore: initialScore,
//             targetScore: $scope.target,
//             seed: $scope.seed.model + '_' + $scope.seed.pos,
//             level: 1,
//             type: seedType,
//             fake: $scope.fake,
//             leeway: $scope.leeway
//         }).then((function (data) {
//         }), function (err) {
//     });
//     }
//
//
//
//
//     function mapModels() {
//         var res = {};
//
//         for (var model in models) {
//             var curRes = [];
//             var curModel = models[model];
//
//             for (var i = 0; i < curModel.length; i ++) {
//                 curRes.push({pos: i, props: curModel[i], score: 0});
//             }
//             res[model] = curRes;
//         }
//
//         return res;
//     }
//
//     function setLeeway() {
//         if (!$scope.fake) {
//             Restangular.one('/get_seed_attempts/' + $scope.seed.model + '_' + $scope.seed.truepos)
//                 .get().then(function (serverJson) {
//                 if (serverJson.inlier / serverJson.outlier < 0.4) {
//                     $scope.leeway = 0.7;
//                 }
//             });
//         }
//     }
//
//     function start() {
//         // fake level?
//         $scope.fake = initialGroups.length == 0 || tut < 5;
//
//         // set initial score
//         initialScore = calculateOverallScore([], initialGroups);
//         // get a seed
//         getSeed();
//         // setLeeway();
//         // set target score
//         var curGroups = getCurGroupAsArray();
//
//         if (!$scope.fake) {
//             $scope.target = initialScore - calculateOverallScore(curGroups, initialGroups) + 1;
//         } else if (tut == 3)  { // tutorial level
//             $scope.target = 10;
//         } else if (tut == 4) { // tutorial level
//             $scope.target = 80;
//         } else {
//             $scope.target = getRandomInt(100, 200);
//         }
//
//         $scope.seed.pos = positions[$scope.seed.model].pos = $scope.getEleIndexWithPos($scope.seed.model, $scope.seed.truepos);
//
//         // redraw everything
//         redraw();
//
//         saveAttempt();
//
//         $('#loading').fadeOut();
//
//         if (!$scope.fake) {
//             powerRound();
//         }
//     }
//
//     // notify player that this is a power round
//     function powerRound() {
//         $('#power').fadeIn();
//         setTimeout(function(){ $('#power').fadeOut(); }, 3000);
//     }
//
//     function restartSeeds() {
//         prevSeeds = [];
//     }
//
//     function saveSeed() {
//         Restangular.all('/save_seed').post({
//             seed: prevSeeds
//         }).then((function (data) {
//         }), function (err) {
//         });
//     }
//
//     function addSeed(ele) {
//         prevSeeds.push(ele);
//     }
//
//
//     function getSeed() {
//         if (!$scope.fake && Math.random() < 2) { // seed by size
//             seedType = 'size';
//             var smallestGroup = getSmallestArray(initialGroups, prevSeeds);
//
//             if (smallestGroup == null) { // if no smallest group => all seeds rotated through so start over
//                 restartSeeds();
//                 smallestGroup = getSmallestArray(initialGroups, prevSeeds);
//             }
//
//             var ranInt = getRandomInt(0, smallestGroup.length - 1);
//             var ele = smallestGroup[ranInt];
//             addSeed(ele);
//             ele = ele.split('_');
//
//             $scope.seed.model = parseInt(ele[0]);
//             $scope.seed.truepos = parseInt(ele[1]);
//
//         } else if (tut < 5) {
//             var temp = tutSeed.split('_');
//             $scope.seed.model = parseInt(temp[0]);
//             $scope.seed.truepos = parseInt(temp[1]);
//         } else { // seed randomly
//             seedType = 'ran';
//             $scope.seed.model = getRandomInt(0, 7);
//             $scope.seed.truepos = getRandomInt(0, models[$scope.seed.model].length - 1);
//         }
//
//         positions[$scope.seed.model].truepos = $scope.seed.truepos;
//
//         // select the model
//         toggleModel($scope.seed.model, true);
//         // hide the scroll buttons for that model
//         $('.scroll_' + $scope.seed.model.toString()).hide();
//         // now assign it as first element in array
//         swap($scope.modelNames, $scope.modelNames.indexOf($scope.seed.model), 0);
//
//
//         // save seed to database
//         if (!$scope.fake) {
//             saveSeed();
//         }
//     }
//
//     function getPrevSolution() {
//         Restangular.one('/get_best_solution')
//             .get().then(function (serverJson) {
//             initialGroups = serverJson.solution.solution;
//             prevSeeds = serverJson.prevSeeds.prevSeeds;
//             tut = serverJson.attempts;
//             tutSeed = serverJson.solution.seed;
//
//             start();
//         });
//     }
//
//     //////////////// END FUNCTIONS FOR GAME INIT ///////////
//
//
//     ////////////// USER ACTION FUNCTIONS ///////////////
//     $scope.giveup = function () {
//         Restangular.all('/give_up').post({
//             duration: (new Date()).getTime() - startTime
//         }).then((function (data) {
//             $state.reload();
//         }), function (err) {
//         });
//     };
//
//     // toggle the selection
//     $scope.select = function (model) {
//         // can't deselect seed
//         if ($scope.seed.model == model) {
//             return;
//         }
//
//         toggleModel(model, false);
//     };
//
//
//     // level 1 = hospital model
//     $scope.submitScore = function () {
//         var cur = getCurGroupAsArray();
//         var solution = getGroupsExclude(cur, initialGroups);
//         solution = solution.concat([cur]);
//
//         Restangular.all('/save_solution').post({
//             score: calculateOverallScore(cur, initialGroups),
//             initialScore: initialScore,
//             targetScore: $scope.target,
//             seed: $scope.seed.model + '_' + $scope.seed.pos,
//             duration: (new Date()).getTime() - startTime,
//             level: 1,
//             solution: solution,
//             type: seedType,
//             fake: $scope.fake
//         }).then((function (data) {
//             Restangular.one('/cur_user').get().then(function (serverJson) {
//                 getScoreBoard();
//
//                 if (serverJson.username.startsWith('guest')) {
//                     $scope.end = 1;
//                 } else {
//                     $scope.end = 2;
//                 }
//             });
//         }), function (err) {
//         });
//     };
//
//     $scope.reload = function() {
//         $state.reload();
//     };
//
//     ////////// END USER ACTION FUNCTIONS /////////////
//
//
//     //////// SCORE CALCULATION FUNCTIONS //////////////
//     // update new element from model
//     // either add to the current group or
//     // remove it from the current group
//     // depending on state.
//     function getScoreBoard () {
//         Restangular.one('/get_scoreboard').get().then(function (serverJson) {
//             $scope.scores = serverJson.scores;
//             $scope.overallScore = serverJson.overallScore;
//             $scope.overallScoreRank = serverJson.rank;
//         });
//     };
//
//     function updateScore() {
//         var curGroup = getCurGroupAsArray(positions);
//
//         if (!$scope.fake) {
//             $scope.score =  calculateOverallScore(curGroup, initialGroups) - initialScore + $scope.target - 1;
//         } else if (tut == 3) {
//             $scope.score = calculateOverallScore(curGroup, initialGroups) - initialScore + 130 + $scope.target - 1;
//         } else if (tut == 4) {
//             $scope.score = calculateOverallScore(curGroup, initialGroups) - initialScore + 342 + $scope.target - 1;
//         } else {
//             $scope.score =  calculateOverallScore(curGroup, initialGroups) - initialScore;
//         }
//
//         if ($scope.score >= $scope.target * $scope.leeway && $scope.target != 0) {
//             endGame();
//         }
//
//     }
//
//     function endGame() {
//         $scope.end = 4; // add overlay
//         $scope.submitScore();
//     }
//
//     $scope.signup = function() {
//         Restangular.all('/signup').post($scope.user).then((function (data) {
//             $scope.taken =  false;
//             if (data == 'taken') {
//                 $scope.taken = true;
//             } else {
//                 $scope.end = 3;
//             }
//
//         }), function (err) {
//
//         });
//
//
//     };
//
//     // return whether thisEle is in current solution
//     // by iterating through curSol
//     function inSolution(thisEle) {
//         for (var group = 0; group < initialGroups.length; group ++) {
//             for (var ele = 0; ele < group.length; ele ++) {
//                 if (initialGroups[group][ele] == thisEle) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }
//
//     function getCurGroupAsArray() {
//         var res = [];
//         for (var model in positions) {
//             if (positions[model].selected == 1) {
//                 res.push(model + '_' + positions[model].truepos);
//             }
//         }
//         return res;
//     }
//
//     // get initial group excluding those in a
//     function getGroupsExclude(a, groups) {
//         var newGroup = [];
//         for (var group = 0; group < groups.length; group ++) {
//             var excludeDupes = removeDupes(groups[group], a);
//             if (excludeDupes.length > 0) {
//                 newGroup.push(excludeDupes);
//             }
//         }
//
//         return newGroup;
//     }
//
//     // calculate overall score, with new group: eles
//     function calculateOverallScore (eles, groups) {
//         var score = 0;
//
//         if (eles.length == 0 && groups.length == 0) {
//             return score;
//         }
//
//         // group to calculate score by removing elements belonging to eles first
//         var groups = getGroupsExclude(eles, groups);
//         // add current group
//         groups = groups.concat([eles]);
//
//         // get score of all other groups
//         for (var group = 0; group < groups.length; group ++) {
//             score += calculateGroupScore(groups[group]);
//         }
//
//         return Math.round(score * 10000);
//     }
//
//     function propDistInGroup(group) {
//         var propDist = {};
//
//         // iterate through each element
//         // then iterate through each prop in each element
//         // if prop not already in the dict, add it
//         // else, increment the number of elements by one
//         for (var i = 0; i < group.length; i ++) {
//             var ele = group[i].split('_');
//             var model = parseInt(ele[0]);
//             var pos = parseInt(ele[1]);
//
//             var ind = $scope.getEleIndexWithPos(model, pos);
//
//             var temp = models[model][ind].props;
//             // console.log(props);
//             var props = temp.filter (function (value, index, array) {
//                 return array.indexOf (value) == index;
//             });
//
//             for (var prop = 0; prop < props.length; prop ++) {
//                 if (propDist[props[prop]] == null) {
//                     propDist[props[prop]] = 1;
//                 } else {
//                     propDist[props[prop]] ++;
//                 }
//             }
//         }
//         // console.log(propDist);
//
//         return propDist;
//     }
//
//     function calculateGroupScore(group) {
//         var score = 0;
//         var pi_t = 0;
//         var n_squared = 64;
//         var m = group.length;
//
//         var propDist = propDistInGroup(group);
//         pi_t = Object.keys(propDist).length;
//
//         if (pi_t == 0) {
//             return 0;
//         }
//
//         for (var j = 2; j <= m; j ++) {
//             var n_p_j = 0;
//
//             for (var prop in propDist) {
//                 if (propDist[prop] == j) {
//                     n_p_j ++;
//                 }
//             }
//             score = score + j * j * n_p_j;
//         }
//         // console.log(group);
//         // console.log(score / (n_squared * pi_t) * 10000);
//         return score / (n_squared * pi_t);
//     }
//
//     function getEleContribution(ele) {
//         var temp = ele.split('_');
//         var model = parseInt(temp[0]);
//         var pos = parseInt(temp[1]);
//
//         if ($scope.seed.model == model && $scope.seed) {
//             return $scope.score / ($scope.target * $scope.leeway);
//         }
//
//         var curGroup = getCurGroupAsArray(positions);
//         var scoreWithEle = calculateOverallScore(curGroup, initialGroups);
//
//
//         var ex = getGroupsExclude([ele], [curGroup])[0] || [];
//
//         if (positions[model].selected == - 1) {
//             var scoreWithoutEle = calculateOverallScore(ex, getGroupsExclude([ele], initialGroups));
//
//         } else {
//             var scoreWithoutEle = calculateOverallScore(ex, initialGroups);
//         }
//
//         return (scoreWithEle - scoreWithoutEle) / 1000;
//
//     }
//
//     ////// GAME SCREEN FUNCTIONS /////////
//
//     // update the highlighted elements and update the score
//     // gets called after a new element gets added/removed from the
//     // group
//     function redraw() {
//         // update score
//         updateScore();
//         // update contributions of each element
//         // updateContributions();
//
//         // redraw elements
//         for (var i = 0; i < $scope.modelNames.length; i++) {
//             $scope.getNext(i, '0');
//         }
//     }
//
//     // draw contribution bar
//     function drawContBar(model, c) {
//         var cont = getEleContribution(model + '_' + positions[model].truepos);
//         var eles = document.getElementById('model_' + model);
//
//         var con = c.getContext('2d');
//         c.height = dim;
//         c.width = 10 + eles.width;
//         con.drawImage(eles, 10, 0);
//
//
//         if (positions[model].selected == -1) {
//             con.fillStyle = 'red';
//             con.fillRect(0, 0, 5, dim);
//             var fillWidth = 60 - Math.round(dim * cont); // +
//             con.fillStyle = '#cee1ff';
//             con.fillRect(0, 0, 5, fillWidth);
//         } else {
//             con.fillStyle = 'red';
//             con.fillRect(0, 0, 5, dim);
//             var fillWidth = 60 - Math.round(dim * cont);
//             con.fillStyle = '#cee1ff';
//             con.fillRect(0, 0, 5, fillWidth);
//         }
//     }
//
//     // draw properties onto canvas c
//     // also pass in the model that element
//     // belongs to since we don't include it as
//     // a common property
//     function draw(props, highlight, c, model) {
//         props.sort();
//         var con = c.getContext('2d');
//         c.height = dim;
//         c.width = dim * props.length;
//
//         // get common properties current current element
//         var common = getCommonProps(model, props);
//
//         // highlight properties (i.e. fill cell with yellow bg) that are similar to current group
//         for (var i = 0; i < props.length; i ++) {
//             if (highlight && isInList(common, props[i])) {
//                 con.rect(i*dim, 0, dim, dim);
//                 con.fillStyle = 'yellow';
//             }
//         }
//         con.fill();
//
//         // draw all the creature images
//         for (var i = 0; i < props.length; i ++) {
//             con.drawImage(images[props[i] - 1], 0, 0, 60, 60, i*dim, 0, dim, dim);
//         }
//     }
//
//     // get a list of common properties in currently selected group and
//     // element, returns a list of them
//     function getCommonProps(model, a) {
//         var common = [];
//         for (var key in positions) {
//             if (model != key && positions[key].selected != -1) {
//                 for (var i = 0; i < a.length; i ++) {
//                     if (isInList(models[key][positions[key].pos].props, a[i])) {
//                         common.push(a[i]);
//                     }
//                 }
//             }
//         }
//         return common;
//     }
//     /////// END OF GAME SCREEN FUNCTIONS ////////
//
//     ////////////// HELPER FUNCTIONS //////////////
//     function isInList(a, b) {
//         for (var i = 0; i < a.length; i ++) {
//             if (a[i] == b) {
//                 return true;
//             }
//         }
//         return false;
//     }
//
//     // remove any occurrences of a2 from a1.
//     function removeDupes(a1, a2) {
//         var res = [];
//         for (var i = 0; i < a1.length; i ++) {
//             if (!isInList(a2, a1[i])) {
//                 res.push(a1[i]);
//             }
//         }
//         return res;
//     }
//
//     function hasClass(element, cls) {
//         return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
//     }
//
//     function getRandomInt(min, max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//     }
//
//     // get smallest array in an array of arrays
//     function getSmallestArray(a, exclude) {
//         var index = -1;
//         var minLen = 10000;
//
//         for (var i = 0; i < a.length; i ++) {
//             // if min length and none of its elements are in exclude
//             if (a[i].length < minLen) {
//                 var isValid = true;
//                 for (var j = 0; j < a[i].length; j ++) {
//                     if (isInList(exclude, a[i][j])) {
//                         isValid = false;
//                     }
//                 }
//
//                 if (isValid) {
//                     index = i;
//                     minLen = a[i].length;
//                 }
//             }
//         }
//
//         return a[index];
//     }
//
//     function shuffle(array) {
//         var currentIndex = array.length, temporaryValue, randomIndex;
//
//         // While there remain elements to shuffle...
//         while (0 !== currentIndex) {
//
//             // Pick a remaining element...
//             randomIndex = Math.floor(Math.random() * currentIndex);
//             currentIndex -= 1;
//
//             // And swap it with the current element.
//             temporaryValue = array[currentIndex];
//             array[currentIndex] = array[randomIndex];
//             array[randomIndex] = temporaryValue;
//         }
//
//         return array;
//     }
//
//     function swap(array, a, b) {
//         var temp = array[a];
//         array[a] = array[b];
//         array[b] = temp;
//     }
//
//     ///////////// END HELPER FUNCTIONS /////////////
//
//     $scope.Math = window.Math;
//
// });
