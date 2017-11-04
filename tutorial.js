/**
 * Created by Christina on 2016-12-08.
 */

// comment out saveAttempt, change modelNames, positions, dont shuffle, dont set target
// suggest, friend, cont bar
// updatscore
app.controller('tutorialCtrl', function($scope, Restangular, $state) {

    $scope.end = 0; //0 = not ended, 1 = end state for guest, 2 = end state for registered user

    // signing up
    $scope.user = {username: null, password: null, email: null, turk: null};
    $scope.taken = false; // username is taken

    /// initialization code and global variables //////////
    $scope.score = 0;
    $scope.target;

    // size of elements
    var dim = 120;


    // hospital model
    var models = {
        0 : [
            [73, 101, 136, 66],
            [33, 186, 73],
            [28, 136]
        ],
        1:  [
            [48, 28, 33, 136],
            [66, 113, 73, 101],
            [113, 150]
        ],
        2:  [
            [73, 33, 66],
            [101, 136, 66, 48],
            [9, 150, 28],
            [28, 66]
        ],
        3:  [
            [113, 48],
            [33]
        ]
    };
    var positions = {
        0: {pos: 0, selected: -1, reorder: -1},
        1: {pos: 0, selected: -1, reorder: -1},
        2: {pos: 0, selected: -1, reorder: -1},
        3: {pos: 0, selected: -1, reorder: -1}
    };

    models = mapModels();
    $scope.models = models;
    $scope.fake = true; // fake rounds

    // names of each model
    $scope.modelNames = [0, 1, 2, 3];
    // $scope.modelNames = shuffle($scope.modelNames);
    $scope.positions = positions;

    /// initial solution
    var initialGroups = [];
    var seedType = null;
    var prevSeeds = [];
    var startTime = (new Date()).getTime();
    var initialScore = 0;

    // load images of all 162 properties and add then
    // to variable images
    $scope.numLoaded = 0;
    var images = [];

    // store seed element
    $scope.seed = {
        model: null,
        pos: null,
        truepos: null
    };

    $scope.leeway = 1.0;

    $scope.suggestions = {suggestionList: [], counter: -1};
    $scope.scroll = {counter: 0, max: modelWithMaxLength()};

    var isMobile = false; //initiate as false
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;


    getPrevSolution();

    ///// end of initialization code and variables /////////

    function saveAttempt() {
        Restangular.all('/save_attempt').post({
            initialScore: initialScore,
            targetScore: $scope.target,
            seed: $scope.seed.model + '_' + $scope.seed.pos,
            level: level,
            type: seedType,
            fake: $scope.fake,
            leeway: $scope.leeway,
            isMobile: isMobile
        }).then((function (data) {
        }), function (err) {
        });
    }

    // score each element based on the most similar element from its tuple. Similarity of element
    // e is calculated by taking the score of the tuple formed by placing e in tuple ele
    function scoreByGroupSim(ele) {
        for (var i = 0; i < initialGroups.length; i ++) {
            var maxPairwiseScore = 0;
            // get max pairwise score
            for (var j = 0; j < initialGroups[i].length; j ++) {
                if (($scope.seed.model.toString() ==  initialGroups[i][j].split('_')[1])) {
                    continue;
                }

                var model = parseInt(initialGroups[i][j].split('_')[0]);
                var pos = $scope.getEleIndexWithPos(model, parseInt(initialGroups[i][j].split('_')[1]));

                var gr = ele.slice(0);
                gr.push(initialGroups[i][j]);
                var score = calculateGroupScore(gr);

                if (score > maxPairwiseScore) {
                    maxPairwiseScore = score;
                }
            }

            // assign all elements in group to have this score
            for (var j = 0; j < initialGroups[i].length; j ++) {
                var temp = initialGroups[i][j].split('_');
                var model = parseInt(temp[0]);
                var pos = $scope.getEleIndexWithPos(model, parseInt(temp[1]));

                models[model][pos].gscore = maxPairwiseScore;
            }
        }
    }

    // ele not true pos
    // score each element based on its similarity to elements in ele. Similarity of element
    // e is calculated by taking the score of the tuple formed by placing e in tuple ele
    function scoreByPairwiseSim(ele) {

        //  $scope.getEleIndexWithPos
        for (var i = 0; i < initialGroups.length; i ++) {
            var maxPairwiseScore = 0;
            // get max pairwise score
            for (var j = 0; j < initialGroups[i].length; j ++) {
                var model = parseInt(initialGroups[i][j].split('_')[0]);
                var pos = $scope.getEleIndexWithPos(model, parseInt(initialGroups[i][j].split('_')[1]));

                var gr = ele.slice(0);
                gr.push(initialGroups[i][j]);
                var score = calculateGroupScore(gr);

                models[model][pos].score = score;
            }

        }
    }

    // mulilate models array based on results of scoreByPairwiseSim()
    function sortByScore() {
        for (var model in models) {
            models[model].sort(function (a, b) {
                if (a.score < b.score)
                    return 1;
                if (a.score > b.score)
                    return -1;
                return 0;
            });
        }
    }

    $scope.getEleIndexWithPos = function(model, pos) {
        var curModel = models[model];

        for (var i = 0; i < curModel.length; i ++) {
            if (curModel[i].pos == pos) {
                return i;
            }
        }
    };

    function mapModels() {
        var res = {};

        for (var model in models) {
            var curRes = [];
            var curModel = models[model];

            for (var i = 0; i < curModel.length; i ++) {
                curRes.push({pos: i, props: curModel[i], score: 0, color: null});
            }
            res[model] = curRes;
        }

        return res;
    }


    function setAlpha() {
        var alpha = [];

        for (var i = 1; i <= 162; i ++) {
            alpha.push({prop: i, count: 0});
        }

        return alpha;
    }

    // start game initial configuration
    function buildSuggestions() {
        $scope.suggestions.suggestionList = [];

        var groups = initialGroups;
        for (var group = 0; group < groups.length; group ++) {
            // get an ele from this group, doesn't matter which so just pick first
            var ele = groups[group][0];
            var temp = ele.split('_');
            var model = parseInt(temp[0]);
            var pos = parseInt(temp[1]);
            var ind = $scope.getEleIndexWithPos(model, pos);
            var score = models[model][ind].gscore;

            if (score > 0 && groups[group].length > 0) {
                $scope.suggestions.suggestionList.push({score: score, group: groups[group]});
            }
        }

        // sort suggestions by score
        $scope.suggestions.suggestionList.sort(function (a, b) {
            if (a.score < b.score)
                return 1;
            if (a.score > b.score)
                return -1;
            return 0;
        });

        // swap($scope.suggestions.suggestionList, 0, $scope.suggestions.suggestionList.length - 1);
    }

    $scope.getSuggestion = function (dir) {
        // get a suggestion based on counter value

        if (dir == '-') { // check if can still move (i.e. there are still elements to be seen in dir -)
            if ($scope.suggestions.counter < 0) {
                $scope.suggestions.counter = $scope.suggestions.suggestionList.length - 1;
            } else {
                $scope.suggestions.counter--;
            }
        } else if (dir == '+') { // check if can still move (i.e. there are still elements to be seen in dir +)
            if ($scope.suggestions.counter >= $scope.suggestions.suggestionList.length - 1) {
                $scope.suggestions.counter = -1;
            } else {
                $scope.suggestions.counter++;
            }
        }

        if ($scope.suggestions.counter == -1) {
            var group = [];
            for (var model in models) {
                var ele = model + '_' + models[model][0].pos;
                group.push(ele);
            }
        } else {
            var group = $scope.suggestions.suggestionList[$scope.suggestions.counter].group;
        }

        for (var ele = 0; ele < group.length; ele ++) {
            var temp = group[ele].split('_');
            var model = parseInt(temp[0]);
            if (positions[model].selected == -1) {
                var pos = parseInt(temp[1]);

                positions[model].truepos = pos;
                positions[model].pos = $scope.getEleIndexWithPos(model, pos);

            }
        }

        // now redraw everything
        redraw();

    };


    $scope.toggleModelReorder = function (model) {
        if (positions[model].reorder == 1) {
            positions[model].reorder = -1;
            $('#reorder_' + model).removeClass('green');
        } else if (positions[model].reorder == -1) {
            positions[model].reorder = 1;
            $('#reorder_' + model).addClass('green');

        }

        $scope.reorder();
        redraw();
    };

    $scope.reorder = function() {
        var ele = [];
        for (var model in positions) {
            if (positions[model].selected == 1 && positions[model].reorder == 1) {
                ele.push(model + '_' + positions[model].truepos);
            }
        }

        scoreByGroupSim(ele);
        scoreByPairwiseSim(ele);
        sortByScore();
        buildSuggestions();

        for (var model in positions) {
            positions[model].pos = $scope.getEleIndexWithPos(model, positions[model].truepos);
        }

        // reset suggestion counter
        $scope.suggestions.counter = -1;
        $scope.scroll.counter = 0;

        // redraw and reset position index to 0
        var group = [];
        for (var model in models) {
            var ele = model + '_' + models[model][0].pos;
            group.push(ele);
        }

        for (var ele = 0; ele < group.length; ele ++) {
            var temp = group[ele].split('_');
            var model = parseInt(temp[0]);
            if (positions[model].selected == -1) {
                var pos = parseInt(temp[1]);

                positions[model].truepos = pos;
                positions[model].pos = $scope.getEleIndexWithPos(model, pos);

            }
        }

    };

    function setLeeway() {
        if ($scope.fake) {
            $scope.leeway = Math.random();
        }
    }

    function start() {

        restart();


        // fake level?
        $scope.fake = false;

        // set initial score
        initialScore = calculateOverallScore([], initialGroups);

        // get a seed
        getSeed();

        // set target score
        var curGroups = getCurGroupAsArray();

        $scope.target = Math.ceil(initialScore - calculateOverallScore(curGroups, initialGroups) + 1);
        $scope.seed.pos = positions[$scope.seed.model].pos = $scope.getEleIndexWithPos($scope.seed.model, $scope.seed.truepos);

        assignColors(); // don't need to use trupos because this is prior to sorting

        $scope.toggleModelReorder($scope.seed.model);

        // redraw everything
        redraw();

        $('#loading').fadeOut();

        // if (!$scope.fake) {
        //     powerRound();
        // }
    }

    // notify player that this is a power round
    function powerRound() {
        $('#power').fadeIn();
        setTimeout(function(){ $('#power').fadeOut(); }, 3000);
    }

    function assignColors() {
        var hues = ['yellow', 'red', 'green', 'orange', 'blue', 'purple', 'pink'];
        var cols = randomColor({
            count: initialGroups.length,
            luminosity: 'bright',
            format: 'hex'
        });


        for (var i = 0; i < initialGroups.length; i ++) {
            var group = initialGroups[i];


            for (var j = 0; j < group.length; j ++) {
                var temp = group[j].split('_');
                var model = parseInt(temp[0]);
                var ele = parseInt(temp[1]);

                models[model][ele].color = cols[i];
            }
        }
    }

    function restartSeeds() {
        prevSeeds = [];
    }

    function saveSeed() {
        Restangular.all('/save_seed').post({
            seed: prevSeeds,
            level: level
        }).then((function (data) {
        }), function (err) {
        });
    }

    function addSeed(ele) {
        prevSeeds.push(ele);
    }


    function getSeed() {
        // if (tut >= 5) { // seed by size
        seedType = 'size';
        var smallestGroup = getSmallestArray(initialGroups, prevSeeds);

        if (smallestGroup == null) { // if no smallest group => all seeds rotated through so start over
            restartSeeds();
            smallestGroup = getSmallestArray(initialGroups, prevSeeds);
        }

        var ranInt = getRandomInt(0, smallestGroup.length - 1);
        var ele = smallestGroup[ranInt];
        addSeed(ele);
        ele = ele.split('_');

        $scope.seed.model = parseInt(ele[0]);
        $scope.seed.truepos = parseInt(ele[1]);
        // }
        // else if (tut < 5) {
        //     var temp = tutSeed.split('_');
        //     $scope.seed.model = parseInt(temp[0]);
        //     $scope.seed.truepos = parseInt(temp[1]);
        // }
        //     else { // seed randomly
        //         seedType = 'ran';
        //         $scope.seed.model = getRandomInt(0, 7);
        //         $scope.seed.truepos = getRandomInt(0, models[$scope.seed.model].length - 1);
        // }

        positions[$scope.seed.model].truepos = $scope.seed.truepos;

        // select the model
        toggleModel($scope.seed.model, true);
        // hide the scroll buttons for that model
        // $('.scroll_' + $scope.seed.model.toString()).hide();
        // now assign it as first element in array
        swap($scope.modelNames, $scope.modelNames.indexOf($scope.seed.model), 0);


        // save seed to database
        if (!$scope.fake) {
            saveSeed();
        }
    }

    function getPrevSolution() {
        Restangular.one('/get_best_solution/' + level.toString())
            .get().then(function (serverJson) {
            initialGroups = serverJson.solution.solution;
            prevSeeds = serverJson.prevSeeds.prevSeeds;
            // tut = serverJson.attempts;
            // tutSeed = serverJson.solution.seed;

            loadImages();

        });
    }


    function loadImages() {
        for (var i = 1; i <= 162; i ++) {
            var img = new Image();
            img.onload = function() {
                $scope.numLoaded++;
                if ($scope.numLoaded == 162) {
                    start(); //start game when all images have loaded
                }
            };
            img.src = 'https://chrchung.github.io/Creatures/' + i + '.png';
            img.width = dim;
            img.height = dim;
            images.push(img);
        }
    }
    //////////////// END FUNCTIONS FOR GAME INIT ///////////


    ////////////// USER ACTION FUNCTIONS ///////////////
    $scope.giveup = function () {
        Restangular.all('/give_up').post({
            duration: (new Date()).getTime() - startTime
        }).then((function (data) {
            $state.reload();
        }), function (err) {
        });
    };



    // rotate through models
    $scope.getNextAll = function(dir) {
        if ($scope.scroll.max == -1) {
            return;
        }

        var start = allAtBound(true);
        var end = allAtBound(false);

        if (start && dir == '-') {
            $scope.scroll.counter = models[$scope.scroll.max].length - 1;
        } else if (end && dir == '+') {
            $scope.scroll.counter = 0;
        } else if (dir == '-') {
            $scope.scroll.counter --;
        } else {
            $scope.scroll.counter ++;
        }

        for (var model in models) {
            if (positions[model].selected == -1) {
                if (dir == '-') { // check if can still move (i.e. there are still elements to be seen in dir -)
                    if (positions[model].pos <= 0) {
                        if (start) {
                            positions[model].pos = models[model].length - 1;
                        }
                    } else {
                        positions[model].pos--;
                    }
                } else if (dir == '+') { // check if can still move (i.e. there are still elements to be seen in dir +)
                    if (positions[model].pos >= models[model].length - 1) {
                        if (end) {
                            positions[model].pos = 0;
                        }
                    } else {
                        positions[model].pos++;
                    }
                }

                $scope.getNext(model, 'preset');
            }
        }

        addTrace('getNextAll');
    };



    // get next element in model, given dir
    // if dir == + (then move up the list)
    // if dir == - (then move down the list)
    // if dir == 0 (don't move, but update the highlighted properties -- need to do this
    // if new elements gets added or removed from the list)
    $scope.getNext = function (model, dir) {

        var prevPos = positions[model].pos;

        if (dir == '-') { // check if can still move (i.e. there are still elements to be seen in dir -)
            if (positions[model].pos <= 0) {
                positions[model].pos = models[model].length - 1;
            } else {
                positions[model].pos--;

            }
        } else if (dir == '+') { // check if can still move (i.e. there are still elements to be seen in dir +)
            if (positions[model].pos >= models[model].length - 1) {
                positions[model].pos = 0;
            } else {
                positions[model].pos++;
            }
        } else if (dir == '0' || dir == 'preset') {

        } else { // can't move, so don't do anything
            return;
        }


        // draw this element again, get its properties
        // var props = models[model][pos % models[model].length];
        var props = models[model][positions[model].pos].props;

        var ind = models[model][positions[model].pos].pos;
        positions[model].truepos = ind;

        draw(props, true, document.getElementById('model_' + model), model);

        drawContBar(model, document.getElementById('cont_bar_' + model));
        drawFriendBar(model, document.getElementById('friend_bar_' + model));
        drawSuggestBar(model, document.getElementById('suggest_bar_' + model));

        // redraw all other elements, if element changed (i.e. if dir != '0')
        // and model is selected
        if (dir != '0' && positions[model].selected > -1) {
            redraw();
        }
    };

    // toggle the selection
    $scope.select = function (model) {

        // can't deselect seed
        if ($scope.seed.model == model) {
            return;
        }

        toggleModel(model, false);
    };


    function toggleModel (model, init) {
        if (positions[model].selected == 1) {
            positions[model].selected = -1;
            $('#suggest_bar_' + model).removeClass('selected');

            if (positions[model].reorder == 1) {
                positions[model].reorder = -1;

                $('#reorder_' + model).removeClass('green');
            }

            $('#reorder_' + model).css({"visibility":"hidden"});


        } else if (positions[model].selected == -1) {
            positions[model].selected = 1;
            $('#suggest_bar_' + model).addClass('selected');

            if ($scope.states[$scope.tutState].checks) {
                $('#reorder_' + model).css({"visibility":"visible"});
            }
        }

        $scope.scroll.max = modelWithMaxLength();

        if (!init) {
            redraw();
        }
    }


    // level 1 = hospital model

    $scope.reload = function() {
        $state.reload();
    };

    ////////// END USER ACTION FUNCTIONS /////////////


    //////// SCORE CALCULATION FUNCTIONS //////////////
    // update new element from model
    // either add to the current group or
    // remove it from the current group
    // depending on state.
    function getScoreBoard () {
        Restangular.one('/get_scoreboard').get().then(function (serverJson) {
            $scope.scores = serverJson.scores;
            $scope.overallScore = serverJson.overallScore;
            $scope.overallScoreRank = serverJson.rank;

            Restangular.one('/get_performance').get().then(function (serverJson) {
                $scope.performance = serverJson;
            });

        });
    }

    function updateScore() {
        var curGroup = getCurGroupAsArray(positions);

        $scope.score = calculateOverallScore(curGroup, initialGroups) - initialScore + $scope.target - 1;

        if ($scope.score >= $scope.target * $scope.leeway && $scope.target != 0) {
            endGame();
        }

    }

    function endGame() {
        $scope.end = 4; // add overlay
        $scope.submitScore();
    }

    $scope.signup = function() {
        Restangular.all('/signup').post($scope.user).then((function (data) {
            $scope.taken =  false;
            if (data == 'taken') {
                $scope.taken = true;
            } else {
                $scope.end = 3;
            }

        }), function (err) {

        });


    };

    // return whether thisEle is in current solution
    // by iterating through curSol
    function inSolution(thisEle) {
        for (var group = 0; group < initialGroups.length; group ++) {
            for (var ele = 0; ele < group.length; ele ++) {
                if (initialGroups[group][ele] == thisEle) {
                    return true;
                }
            }
        }
        return false;
    }

    function getCurGroupAsArray() {
        var res = [];
        for (var model in positions) {
            if (positions[model].selected == 1) {
                res.push(model + '_' + positions[model].truepos);
            }
        }
        return res;
    }

    // get initial group excluding those in a
    function getGroupsExclude(a, groups) {
        var newGroup = [];
        for (var group = 0; group < groups.length; group ++) {
            var excludeDupes = removeDupes(groups[group], a);
            if (excludeDupes.length > 0) {
                newGroup.push(excludeDupes);
            }
        }

        return newGroup;
    }

    // calculate overall score, with new group: eles
    function calculateOverallScore (eles, groups) {
        var score = 0;

        if (eles.length == 0 && groups.length == 0) {
            return score;
        }

        // group to calculate score by removing elements belonging to eles first
        var groups = getGroupsExclude(eles, groups);
        // add current group
        groups = groups.concat([eles]);

        // get score of all other groups
        for (var group = 0; group < groups.length; group ++) {
            score += calculateGroupScore(groups[group]);
            // console.log(groups[group] + ': ' + calculateGroupScore(groups[group]) * 10000);
        }

        return Math.round(score * 10000);
    }

    function propDistInGroup(group) {
        var propDist = {};

        // iterate through each element
        // then iterate through each prop in each element
        // if prop not already in the dict, add it
        // else, increment the number of elements by one
        for (var i = 0; i < group.length; i ++) {
            var ele = group[i].split('_');
            var model = parseInt(ele[0]);
            var pos = parseInt(ele[1]);

            var ind = $scope.getEleIndexWithPos(model, pos);

            var temp = models[model][ind].props;
            // console.log(props);
            var props = temp.filter (function (value, index, array) {
                return array.indexOf (value) == index;
            });

            for (var prop = 0; prop < props.length; prop ++) {
                if (propDist[props[prop]] == null) {
                    propDist[props[prop]] = 1;
                } else {
                    propDist[props[prop]] ++;
                }
            }
        }
        // console.log(propDist);

        return propDist;
    }

    function calculateGroupScore(group) {
        var score = 0;
        var pi_t;
        var n_squared = Math.pow(Object.keys(models).length, 2);
        var m = group.length;

        var propDist = propDistInGroup(group);
        pi_t = Object.keys(propDist).length;

        if (pi_t == 0) {
            return 0;
        }

        for (var j = 2; j <= m; j ++) {
            var n_p_j = 0;

            for (var prop in propDist) {
                if (propDist[prop] == j) {
                    n_p_j ++;
                }
            }
            score = score + j * j * n_p_j;
        }

        return score / (n_squared * pi_t);
    }

    // add props to alpha if add = true, else remove props from alpha
    function updateAlpha(props, alpha) {
        for (var i = 0; i < props.length; i++) {
            var curProp = props[i];

            if (alpha[curProp]) {
                alpha[curProp]++;
            } else {
                alpha[curProp] = 1;
            }
        }
    }

    // calculate opacity of blue highlight. opacity is calculated as follows:
    // get total occurrence of each property in the current tuple being formed,
    // sort the properties by # of occurrences in descending order
    // opacity  of element = (total number of elements - element's position) / total number of elements
    function getAlphas() {
        var alpha = {};
        var ord;

        for (var model in positions) {
            if (positions[model].selected > -1) {
                var props = models[model][positions[model].pos].props;
                updateAlpha(props, alpha);
            }
        }

        ord = Object.keys(alpha).map(function(key) {
            return alpha[key];
        });
        ord.sort(function(a, b){return b - a});

        var uniqueOrds = [];

        $.each(ord, function(i, el){
            if($.inArray(el, uniqueOrds) === -1) uniqueOrds.push(el);
        });

        return {alpha: alpha, ord: uniqueOrds};
    }

    // get elements contribution to global score
    function getEleContribution(ele) {
        var temp = ele.split('_');
        var model = parseInt(temp[0]);

        if ($scope.seed.model == model && $scope.seed) {
            return $scope.score / ($scope.target * $scope.leeway);
        }

        var curGroup = getCurGroupAsArray(positions);
        var scoreWithEle = calculateOverallScore(curGroup, initialGroups);


        var ex = getGroupsExclude([ele], [curGroup])[0] || [];

        if (positions[model].selected == - 1) {
            var scoreWithoutEle = calculateOverallScore(ex, getGroupsExclude([ele], initialGroups));

        } else {
            var scoreWithoutEle = calculateOverallScore(ex, initialGroups);
        }

        return (scoreWithEle - scoreWithoutEle) / 1000;
    }


    ////// END OF SCORE CALCULATION FUNCTIONS //////////


    ////// GAME SCREEN FUNCTIONS /////////

    // update the highlighted elements and update the score
    // gets called after a new element gets added/removed from the
    // group
    function redraw() {
        // update score
        updateScore();
        // update contributions of each element
        // updateContributions();

        // redraw elements
        for (var model in models) {
            $scope.getNext(model, '0');
        }
    }

    // draw contribution bar
    function drawContBar(model, c) {
        var cont = getEleContribution(model + '_' + positions[model].truepos);
        var eles = document.getElementById('model_' + model);

        var con = c.getContext('2d');
        c.height = dim;
        c.width = 10 + eles.width;
        con.drawImage(eles, 10, 0);

        if (!$scope.states[$scope.tutState].friends) {
            return;
        }

        if (positions[model].selected == -1) {
            con.fillStyle = 'red';
            con.fillRect(0, 0, 5, dim);
            var fillWidth = 120 - Math.round(dim * cont); // +
            con.fillStyle = '#cee1ff';
            con.fillRect(0, 0, 5, fillWidth);
        } else {
            con.fillStyle = 'red';
            con.fillRect(0, 0, 5, dim);
            var fillWidth = 120 - Math.round(dim * cont);
            con.fillStyle = '#cee1ff';
            con.fillRect(0, 0, 5, fillWidth);
        }
    }


    function drawFriendBar(model, c) {
        var eles = document.getElementById('cont_bar_' + model);

        var con = c.getContext('2d');
        c.height = dim;
        c.width = 30 + eles.width;

        con.drawImage(eles, 0, 0);

        if (!$scope.states[$scope.tutState].friends) {
            return;
        }

        if ($scope.seed.model == model && $scope.seed.pos == positions[model].pos) {
            con.fillStyle = "white";
        } else {
            con.fillStyle = models[model][positions[model].pos].color;
        }

        con.fillRect(eles.width + 5, 0, 30, dim);
    }



    function drawSuggestBar(model, c) {
        var eles = document.getElementById('friend_bar_' + model);

        var con = c.getContext('2d');
        c.height = dim;
        c.width = 10 + eles.width;

        con.drawImage(eles, 0, 0);

        if (!$scope.states[$scope.tutState].suggest) {
            return;
        }

        var ind = $scope.suggestions.counter;
        if (ind == -1) {
            return;
        }

        var group = $scope.suggestions.suggestionList[ind].group;
        var isFriend = isInList(group, [model + '_' + positions[model].truepos]);

        if (isFriend && (model + '_' + positions[model].truepos != ($scope.seed.model + '_' + $scope.seed.truepos))) {
            con.fillStyle = 'black';
        } else {
            con.fillStyle = 'white';
        }

        con.fillRect(eles.width + 5, 0, 5, dim);
    }



    // draw properties onto canvas c
    // also pass in the model that element
    // belongs to since we don't include it as
    // a common property
    function draw(props, highlight, c, model) {

        var alphas = getAlphas();

        props.sort();
        var con = c.getContext('2d');
        c.height = dim;
        c.width = dim * props.length;
        con.clearRect(0, 0, c.width, c.height);


        // highlight properties (i.e. fill cell with yellow bg) that are similar to current group
        for (var i = 0; i < props.length; i ++) {
            var count = alphas.alpha[props[i]];

            if (highlight && (count > 1  || (count == 1 && positions[model].selected == -1))) {
                var op = (alphas.ord.length - alphas.ord.indexOf(count)) / alphas.ord.length;

                con.rect(i*dim, 0, dim, dim);
                con.fillStyle = 'rgba(0, 242, 255,' + (op).toString() + ')';
                con.fill();
            }
        }


        // draw all the creature images
        for (var i = 0; i < props.length; i ++) {
            con.drawImage(images[props[i] - 1], 0, 0, 120, 120, i*dim, 0, dim, dim);
        }
    }

    // get a list of common properties in currently selected group and
    // element, returns a list of them
    function getCommonProps(model, a) {
        var common = {};

        for (var i = 0; i < a.length; i ++) {
            common[a[i]] = 0;
        }

        for (var key in positions) {
            if (model != key && positions[key].selected != -1) {
                for (var i = 0; i < a.length; i ++) {
                    if (isInList(models[key][positions[key].pos].props, a[i])) {
                        common[a[i]] = common[a[i]] + 1;
                    }

                }
            }
        }
        return common;
    }
    /////// END OF GAME SCREEN FUNCTIONS ////////

    ////////////// HELPER FUNCTIONS //////////////
    function isInList(a, b) {
        for (var i = 0; i < a.length; i ++) {
            if (a[i] == b) {
                return true;
            }
        }
        return false;
    }

    function isInListCountNumTimes(a, b) {
        var count = 0;
        for (var i = 0; i < a.length; i ++) {
            if (a[i] == b) {
                count ++;
            }
        }
        return count;
    }


    // remove any occurrences of a2 from a1.
    function removeDupes(a1, a2) {
        var res = [];
        for (var i = 0; i < a1.length; i ++) {
            if (!isInList(a2, a1[i])) {
                res.push(a1[i]);
            }
        }
        return res;
    }

    function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // get smallest array in an array of arrays
    function getSmallestArray(a, exclude) {
        var index = -1;
        var minLen = 10000;

        for (var i = 0; i < a.length; i ++) {
            // if min length and none of its elements are in exclude
            if (a[i].length < minLen) {
                var isValid = true;
                for (var j = 0; j < a[i].length; j ++) {
                    if (isInList(exclude, a[i][j])) {
                        isValid = false;
                    }
                }

                if (isValid) {
                    index = i;
                    minLen = a[i].length;
                }
            }
        }

        return a[index];
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function swap(array, a, b) {
        var temp = array[a];
        array[a] = array[b];
        array[b] = temp;
    }

    function getIndexOfItem(item, name, obj) {
        for (var i = 0; i < obj.length; i ++) {
            if (obj[i][name] == item) {
                return i;
            }
        }

        return -1;
    }

    // return the unselected model with maximum size
    function modelWithMaxLength() {
        var max = -1;
        for (var model in models) {
            if (positions[model].selected == 1) {
                continue;
            }
            max = (max == - 1 || models[model].length > models[max].length) ? model : max;
        }

        return max;
    }

    // check if all unselected row are at index 0 or last index
    function allAtBound(start) {
        for (var model in models) {
            if ($scope.seed.model == model) {
                continue;
            }

            if (start && positions[model].selected == -1 && positions[model].pos != 0) {
                return false;
            } else if (!start && ($scope.scroll.max == - 1 || positions[$scope.scroll.max].pos != models[$scope.scroll.max].length - 1)) {
                return false;
            }
        }

        // // dont scroll if all selected
        for (var model in models) {
            if (positions[model].selected == -1) {
                return true;
            }
        }

        return false;
    }

    ///////////// END HELPER FUNCTIONS /////////////

    ///// PLAYER TRACES /////////

    function addTrace() {

    }

    //// END PLAYER TRACES ////////

    $scope.Math = window.Math;

    // Restangular.one('/cur_user').get().then(function (serverJson) {
    //     $scope.cond = serverJson.condition;
    //
    //     getScoreBoard();
    //
    //     if (serverJson.user.startsWith('guest')) {
    //         $scope.end = 1;
    //     } else {
    //         $scope.end = 2;
    //     }
    // });
    //
    //
    // Restangular.one('/get_scoreboard').get().then(function (serverJson) {
    //     $scope.scores = serverJson.scores;
    //     $scope.overallScore = serverJson.overallScore;
    //     $scope.overallScoreRank = serverJson.rank;
    //
    //     Restangular.one('/get_performance').get().then(function (serverJson) {
    //         $scope.performance = serverJson;
    //     });
    //
    // })

    //// TUT UNIQUE CODE

    $scope.next = function(state) {

        $('#done').hide();

        $scope.tutState ++;


        if ($scope.tutState > $scope.states.length - 1) {
            return;
        }


            if ($scope.states[$scope.tutState].showGame) {
                $('#game-panel').show();
                $('#ele-panel').show();
                start();
            } else {
                $('#game-panel').hide();
                $('#ele-panel').hide();
            }

            if ($scope.states[$scope.tutState].suggest) {
                $('#suggest').show();

            } else {
                $('#suggest').hide();
            }
    };

    $scope.states = [
        {showGame: false, highlight: false, friends: false, suggest: false, checks: false, initialGroups: [], seed: '0_0'},
        {showGame: false, highlight: false, friends: false, suggest: false, checks: false, initialGroups: [], seed: '0_0'},
        {showGame: false, highlight: false, friends: false, suggest: false, checks: false, initialGroups: [], seed: '0_0'},
        {showGame: false, highlight: false, friends: false, suggest: false, checks: false, initialGroups: [], seed: '0_0'},
        {showGame: true, highlight: false, friends: false, suggest: false, checks: false, initialGroups: [], seed: '0_0'},
        {showGame: true, highlight: false, friends: false, suggest: false, checks: false, initialGroups: [], seed: '0_0'},
        {showGame: true, highlight: true, friends: true, suggest: false, checks: false, initialGroups: [['0_0', '2_1'], ['1_1', '3_0']], seed: '0_0'},
        {showGame: true, highlight: true, friends: true, suggest: true, checks: false, initialGroups: [['0_0', '2_1'], ['1_0',  '0_2'], ['1_1', '2_0'], ['1_2', '2_2'], ['2_3', '3_0']], seed: '0_0'},
        {showGame: true, highlight: true, friends: true, suggest: true, checks: true, initialGroups: [['0_0', '2_1', '3_1'], ['1_0',  '0_2'], ['1_1', '2_0'], ['1_2', '2_2'], ['2_3', '3_0']], seed: '0_0'}
    ];



    // toggle the selection
    $scope.select = function (model, u = false) {
        // if (states[$scope.tutState].showGame) {
        //     var temp = states[$scope.tutState].targEle.split('_');
        //     var model = parseInt(temp[0]);
        //     var ele = parseInt(temp[1]);
        //
        //     if (model == 1 && positions[model].pos == ele && positions[model].selected == 1) {
        //         $scope.tutState ++;
        //     }else {
        //         $('#bad').fadeIn();
        //         setTimeout(function(){ $('#bad').fadeOut(); }, 700);
        //     }
        //
        // }

        userAc = u;

        // can't deselect seed
        if ($scope.seed.model == model) {
            return;
        }

        toggleModel(model, false);
    };


    function getPrevSolution() {
        initialGroups = [];
        prevSeeds = [];
        loadImages();
    }

    function getSeed() {
        $scope.seed.model = 0;
        $scope.seed.truepos = 0;

        positions[$scope.seed.model].truepos = $scope.seed.truepos;

        // select the model
        toggleModel($scope.seed.model, true);
        // hide the scroll buttons for that model
        $('.scroll_' + $scope.seed.model.toString()).hide();
        // now assign it as first element in array
        swap($scope.modelNames, $scope.modelNames.indexOf($scope.seed.model), 0);
    }

    function updateScore() {
        var curGroup = getCurGroupAsArray(positions);

        // if (tut == 3) {
        //     $scope.score = calculateOverallScore(curGroup, initialGroups) - initialScore + 130 + $scope.target - 1;
        // } else if (tut == 4) {
        //     $scope.score = calculateOverallScore(curGroup, initialGroups) - initialScore + 342 + $scope.target - 1;
        // } else {
        $scope.score = calculateOverallScore(curGroup, initialGroups) - initialScore + $scope.target - 1;
        // }

        if (userAc && $scope.score >= $scope.target * $scope.leeway && $scope.target != 0) {
            userAc = false;

            $('#done').fadeIn('slow');
        }

    }


    function restart() {
        $scope.score = 0;
        $scope.target;

        // hospital model
        models = {
            0 : [
                [73, 101, 136, 66],
                [33, 186, 73],
                [28, 136]
            ],
            1:  [
                [48, 28, 33, 136],
                [66, 113, 73, 101],
                [113, 150]
            ],
            2:  [
                [73, 33, 66],
                [101, 136, 66, 48],
                [9, 150, 28],
                [28, 66]
            ],
            3:  [
                [113, 48],
                [33]
            ]
        };

        positions = {
            0: {pos: 0, selected: -1, reorder: -1},
            1: {pos: 0, selected: -1, reorder: -1},
            2: {pos: 0, selected: -1, reorder: -1},
            3: {pos: 0, selected: -1, reorder: -1}
        };

        models = mapModels();
        $scope.models = models;
        $scope.fake = true; // fake rounds

        // names of each model
        $scope.modelNames = [0, 1, 2, 3];
        // $scope.modelNames = shuffle($scope.modelNames);
        $scope.positions = positions;

        /// initial solution
        initialGroups = [];

        if ($scope.tutState != -1) {
            initialGroups = $scope.states[$scope.tutState].initialGroups;
        }

        seedType = null;
        prevSeeds = [];
        initialScore = 0;

        // store seed element
        $scope.seed = {
            model: null,
            pos: null,
            truepos: null
        };

        $scope.leeway = 1.0;

        $scope.suggestions = {suggestionList: [], counter: -1};
        $scope.scroll = {counter: 0, max: modelWithMaxLength()};

        for (var model in models) {
            $('#suggest_bar_' + model).removeClass('selected');
            $('#reorder_' + model).removeClass('green');
        }
    }

    Restangular.one('/cur_user').get().then(function (serverJson) {
        $scope.cond = serverJson.condition;
        Restangular.one('/get_performance').get().then(function (serverJson) {
            $scope.performance = serverJson;
        });
    });

    var userAc = false;
    $scope.tutState = -1;
    $scope.next(-1);

    function draw2(props, c) {
        var con = c.getContext('2d');
        c.height = dim;
        c.width = dim * props.length;
        con.clearRect(0, 0, c.width, c.height);

        // draw all the creature images
        for (var i = 0; i < props.length; i ++) {
            con.drawImage(images[props[i] - 1], 0, 0, 120, 120, i*dim, 0, dim, dim);
        }
    }

    $scope.end = function() {
        $scope.submitScore();

        $state.go('game');
    };

    $scope.submitScore = function () {
        var cur = getCurGroupAsArray();
        var solution = getGroupsExclude(cur, initialGroups);
        solution = solution.concat([cur]);

        Restangular.all('/save_solution').post({
            score: calculateOverallScore(cur, initialGroups),
            initialScore: initialScore,
            targetScore: $scope.target,
            seed: $scope.seed.model + '_' + $scope.seed.pos,
            duration: (new Date()).getTime() - startTime,
            level: 0,
            solution: solution,
            type: null,
            fake: $scope.fake,
            isMobile: isMobile
        }).then((function (data) {
            Restangular.one('/cur_user').get().then(function (serverJson) {
                $scope.cond = serverJson.condition;

                getScoreBoard();

                if (serverJson.user.startsWith('guest')) {
                    $scope.end = 1;
                } else {
                    $scope.end = 2;
                }
            });
        }), function (err) {
        });
    };


});
