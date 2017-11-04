/**
 * Created by Christina on 2016-12-08.
 */
app.controller('authCtrl', function($scope, Restangular, $state) {
    $scope.user = {username: null, password: null};

    $scope.invalid = false;

    $scope.login = function() {
        Restangular.all('/login').post($scope.user).then((function (data) {
            $state.go('landing');
        }), function (err) {
            $scope.invalid = true;
        });

    };
});
