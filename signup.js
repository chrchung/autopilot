/**
 * Created by Christina on 2016-12-08.
 */

app.controller('signupCtrl', function($scope, Restangular, $state) {

    // signing up
    $scope.user = {username: null, password: null, turk: null, know: false};
    $scope.taken = false; // username is taken

    $scope.signup = function() {
        Restangular.all('/signup_main').post($scope.user).then((function (data) {
            $scope.taken =  false;
            if (data == 'taken') {
                $scope.taken = true;
            } else {
               $state.go('landing');
            }

        }), function (err) {

        });


    };
});
