/**
 * Created by Christina on 2016-12-08.
 */
app.controller('scoreboardCtrl', function($scope, Restangular, $state) {
    var getScores = function () {
        Restangular.one('get_scoreboard').get().then(function (serverJson) {
            $scope.scores = serverJson.scores;
            $scope.overallScore = serverJson.overallScore;
            $scope.overallScoreRank = serverJson.rank;
        });
    };

    getScores();
});
