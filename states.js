app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
        .otherwise('/main');

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: 'main.html',
            controller: 'mainCtrl'
        });

    $stateProvider
        .state('game', {
            url: '/game',
            templateUrl: 'game.html',
            controller: 'gameCtrl'
        });

    $stateProvider
        .state('auth', {
            url: '/auth',
            templateUrl: 'auth.html',
            controller: 'authCtrl'
        });

    $stateProvider
        .state('scoreboard', {
            url: '/scoreboard',
            templateUrl: 'scoreboard.html',
            controller: 'scoreboardCtrl'
        });

    $stateProvider
        .state('tutorial', {
            url: '/tutorial',
            templateUrl: 'tutorial.html',
            controller: 'tutorialCtrl'
        });

    $stateProvider
        .state('game2', {
            url: '/game2',
            templateUrl: 'game2.html',
            controller: 'game2Ctrl'
        });

    $stateProvider
        .state('landing', {
            url: '/landing',
            templateUrl: 'landing.html',
            controller: 'landingCtrl'
        });

    $stateProvider
        .state('about', {
            url: '/about',
            templateUrl: 'about.html'
        });

    $stateProvider
        .state('tips', {
            url: '/tips',
            templateUrl: 'tips.html'
        });


    $stateProvider
        .state('signup', {
            url: '/signup',
            templateUrl: 'signup.html',
            controller: 'signupCtrl'
        });


    $stateProvider
        .state('quit', {
            url: '/quit',
            templateUrl: 'quit.html'
        });

});
