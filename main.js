/**
 * Created by Christina on 2016-12-08.
 */
app.controller('mainCtrl', function($scope, Restangular, $state) {
    $scope.guest = function() {
        Restangular.all('/login').post({
            username: 'keywordismyname', password: 'p'
        }).then((function (data) {
            $state.go('tutorial');
        }), function (err) {
        });

    };
});
