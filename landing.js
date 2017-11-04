/**
 * Created by Christina on 2016-12-08.
 */

app.controller('landingCtrl', function ($scope, Restangular, $state) {

    $scope.game = function () {
        Restangular.one('/seen_tut').get().then(function (serverJson) {
            if (serverJson.seenTut == false) {
                $state.go('tutorial');
            } else {
                $state.go('game');
            }
        });
    };


    Restangular.one('/cur_user').get().then(function (serverJson) {
        $scope.cond = serverJson.condition;
            Restangular.one('/get_performance').get().then(function (serverJson) {
                $scope.performance = serverJson;
            });
    });

    Restangular.one('get_scoreboard').get().then(function (serverJson) {
        $scope.scores = serverJson.scores;
        $scope.overallScore = serverJson.overallScore;
        $scope.overallScoreRank = serverJson.rank;
    });

});
