var express = require('express');
var app = express();
var path = require('path');
var _ = require('lodash');
var bodyParser = require('body-parser');
var session = require('express-session');
var async = require('async');

var Parse = require('parse/node').Parse;
Parse.initialize('yqF3tCWSLAuXloRjz6Ugp2GfNO0EeWFNQ4hc94S5', '0VmAUVSBizkYJFM3BGWSEHfAWq7HNVFDPLTb9URU');
Parse.serverURL = 'https://parseapi.back4app.com/';

app.use(session({secret: 'ssshhhhh', resave: false, saveUninitialized: true}));
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.listen(process.env.PORT || 9000, function () {
    console.log('Example app listening on port 3000!')
});

// helper
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


app.get('/get_seed_attempts/:seed', function(req, res) {
    var Solutions = Parse.Object.extend('Solutions');
    var solutionsQuery = new Parse.Query(Solutions);
    solutionsQuery.equalTo('seed', req.params.seed);

    // // Parse solutions after a particular date
    // var day = new Date("2016-10-26T06:11:42.110Z");
    // solutionsQuery.greaterThanOrEqualTo('createdAt', day);

    // get solutions
    solutionsQuery.find({
        success: function (sols) {
            var inlier = 1;
            var outlier = 1;

            for (var i = 0; i < sols.length; i ++) {
                if (sols[i].attributes.score == null) {
                    outlier ++;
                } else {
                    inlier ++;
                }
            }

            res.json({inlier: inlier, outlier: outlier});

        },
        error: function (error) {
            res.status(400).end();
        }
    });
});

// routes
app.get('/get_best_solution/:level', function (req, res) {
    // get attempts
    var UserData = Parse.Object.extend('UserData');
    var userDataQuery = new Parse.Query(UserData);
    userDataQuery.equalTo('user', req.session.user.username);
    userDataQuery.first({
        success: function (user) {
            //var ranInt = getRandomInt(0, user.attributes.numSucAttempts + 5);


            // if (user.attributes.numAttempts == 3 || user.attributes.numAttempts == 4) {
            //     var Solutions = Parse.Object.extend('Solutions');
            //     var solutionsQuery = new Parse.Query(Solutions);
            //     solutionsQuery.equalTo('user', 'user-study-start-' + user.attributes.numAttempts.toString());
            //
            //     // // Parse solutions after a particular date
            //     // var day = new Date("2016-10-26T06:11:42.110Z");
            //     // solutionsQuery.greaterThanOrEqualTo('createdAt', day);
            //
            //     // get solutions
            //     solutionsQuery.first({
            //         success: function (sol) {
            //             res.json({solution: sol, attempts: user.attributes.numSucAttempts, prevSeeds: []});
            //         },
            //         error: function (error) {
            //             res.status(400).end();
            //         }
            //     });
            // } else {



                var Solutions = Parse.Object.extend('Solutions');
                var solutionsQuery = new Parse.Query(Solutions);
                solutionsQuery.equalTo('fake', false);
                solutionsQuery.notEqualTo('score', null);
                solutionsQuery.equalTo('level', parseInt(req.params.level));

                var day = new Date('2017-11-04T18:06:07.645Z');
                solutionsQuery.greaterThanOrEqualTo('createdAt', day);
                solutionsQuery.descending('score');
                solutionsQuery.limit(5); //

                // // Parse solutions after a particular date
                // var day = new Date("2016-10-26T06:11:42.110Z");
                // solutionsQuery.greaterThanOrEqualTo('createdAt', day);

                // get solutions
                solutionsQuery.find({
                    success: function (sols) {
                      //  var sol = sols[getRandomInt(0, sols.length - 1)];//
                        var sol = sols[0];
                        // get seeds
                        var Seeds = Parse.Object.extend('Seeds');
                        var seedsQuery = new Parse.Query(Seeds);
                        seedsQuery.equalTo('level', parseInt(req.params.level));



                        seedsQuery.first({
                            success: function (seed) {
                                res.json({solution: sol, attempts: user.attributes.numAttempts, sucAttempts: user.attributes.numSucAttempts, prevSeeds: seed});
                            },
                            error: function (error) {
                                res.status(400).end();
                            }
                        });
                     },
                    error: function (error) {
                        res.status(400).end();
                    }
                });
            // }
        },
        error: function (error) {
            res.status(400).end();
        }
    });
});




app.get('/cur_user', function (req, res) {
    if (req.session.user) {
        var UserData = Parse.Object.extend('UserData');
        var userDataQuery = new Parse.Query(UserData);
        userDataQuery.equalTo('user', req.session.user.username);
        userDataQuery.first({
            success: function (user) {
                res.json(user);
            },
            error: function (error) {
                res.status(400).end();
            }
        });
    } else {
        res.status(400).end();
    }
});



app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (username == 'keywordismyname' && req.session.user != null) {
        res.status(200).end();
    }

    // create new guest is guest and there is no previous session
    if (username == 'keywordismyname' && req.session.user == null) {
        req.session.user = {username: 'guest' + (new Date()).getTime()};

        var UserData = Parse.Object.extend('UserData');
        var data = new UserData();
        data.set('numAttempts', 0);
        data.set('numSucAttempts', 0);
        data.set('overallScore', 0);
        data.set('seenTut', false);
        data.set('user', req.session.user.username);

        data.save(null, {
            success: function (result) {
                res.status(200).end();
            },
            error: function (result, error) {
                res.status(400).end();
            }
        });

    } else {
        Parse.User.logIn(username, password, {
            success: function (user) {
                req.session.user = user;
                req.session.prev = null;
                res.json(user);
            },
            error: function (user, error) {
                //track analytics
                res.status(400).end();
            }
        });
    }

});


app.post('/signup_main', function(req, res) {

    var user = new Parse.User();
    user.set('username', req.body.username);
    user.set('password', req.body.password);

    user.signUp(null, {
        success: function(newUser) {
            req.session.user = {username: req.body.username};

            var UserData = Parse.Object.extend('UserData');
            var data = new UserData();
            data.set('numAttempts', 0);
            data.set('numSucAttempts', 0);
            data.set('overallScore', 0);
            data.set('seenTut', false);
            data.set('user', req.session.user.username);
            data.set('turk', req.body.turk);
            data.set('know', req.body.know);

            // var ran = getRandomInt(1, 7);
            //
            // if (ran == 1){
            //     data.set('condition', 'd');
            // } else if (ran == 2) {
            //     data.set('condition', 'ds');
            // } else if (ran == 3) {
            //     data.set('condition', 'ks');
            // } else if (ran == 4) {
            //     data.set('condition', 'ko');
            // } else if (ran == 5) {
            //     data.set('condition', 'kso');
            // } else if (ran == 6) {
            //     data.set('condition', 'dso');
            // } else if (ran == 7){
            //     data.set('condition', 'k');
            // } else {
            //     data.set('condition', 'do');
            // }

            var ran = getRandomInt(1, 3);

            if (ran == 1){
                data.set('condition', 'k');
            } else if (ran == 2) {
                data.set('condition', 'ks');
            } else if (ran == 3) {
                data.set('condition', 'kso');
            } else {
                data.set('condition', 'kos');
            }

            data.save(null, {
                success: function (result) {
                    res.status(200).end();
                },
                error: function (result, error) {
                    res.status(400).end();
                }
            });

        },
            error: function(user, error) {
                res.sendStatus(400);
            }
        });

});



app.post('/signup', function(req, res) {
    var User = Parse.Object.extend('User');
    var userQuery = new Parse.Query(User);
    userQuery.equalTo('username', req.body.username);
    userQuery.find({
        success: function(user) {
            if (user.length > 0 || req.body.username.startsWith('guest')) {
                res.send('taken');
            } else {
                var user = new Parse.User();
                user.set('username', req.body.username);
                user.set('password', req.body.password);
                if (req.body.turk) {
                    user.set('turk', req.body.turk);
                }
                user.signUp(null, {
                    success: function(newUser) {
                        req.session.prev = req.session.user;
                        req.session.user = {username: req.body.username};

                        // set user data to new username
                        var UserData = Parse.Object.extend('UserData');
                        var userDataQuery = new Parse.Query(UserData);
                        userDataQuery.equalTo('user', req.session.prev.username);
                        userDataQuery.first({
                            success: function (user) {
                                user.set('user', req.session.user.username);
                                user.save(null, {
                                    success: function (result) {

                                        // set all solutions to new username
                                        var Solutions = Parse.Object.extend('Solutions');
                                        var solutionsQuery = new Parse.Query(Solutions);

                                        solutionsQuery.equalTo('user', req.session.prev.username);
                                        solutionsQuery.descending('createdAt');

                                        solutionsQuery.find({
                                            success: function (solutions) {
                                                async.each(solutions, function(solution, callback) {
                                                    solution.set('user', req.session.user.username);
                                                    solution.save(null, {
                                                        success: function (data) {
                                                            callback();
                                                        },
                                                        error: function (data, error) {
                                                            res.status(200).end();
                                                        }
                                                    });
                                                }, function(err) {
                                                    // if any of the file processing produced an error, err would equal that error
                                                    if( err ) {
                                                        res.status(400).end();

                                                    } else {
                                                        res.status(200).end();
                                                    }
                                                });

                                            },
                                            error: function (error) {
                                                res.status(400).end();
                                            }
                                        });

                                        // res.status(200).end();
                                    },
                                    error: function (result, error) {
                                        res.status(400).end();
                                    }
                                });

                            },
                            error: function (error) {
                                res.status(400).end();
                            }
                        });


                        res.status(200).end();
                    },
                    error: function(user, error) {
                        res.sendStatus(400);
                    }
                });
            }
        },
        error: function(error) {
            res.status(500).end();
        }
    });
});


app.post('/save_seed', function(req, res) {
    var Seeds = Parse.Object.extend('Seeds');
    var seedsQuery = new Parse.Query(Seeds);

    seedsQuery.equalTo('level', req.body.level);

    seedsQuery.first({
        success: function (seed) {
            seed.set('prevSeeds', req.body.seed);

            seed.save(null, {
                success: function (data) {
                    res.status(200).end();
                },
                error: function (data, error) {
                    res.status(400).end();
                }
            });
        },
        error: function (error) {
            res.status(400).end();
        }
    });
});

app.post('/give_up', function(req, res) {
    var Solutions = Parse.Object.extend('Solutions');
    var solutionsQuery = new Parse.Query(Solutions);
    solutionsQuery.descending('createdAt');

    solutionsQuery.first({
        success: function (solution) {
            solution.set('duration', req.body.duration);
            solution.save(null, {
                success: function (data) {
                    res.status(200).end();
                },
                error: function (data, error) {
                    res.status(400).end();
                }
            });
        },
        error: function (error) {
            res.status(400).end();
        }
    });
});

app.post('/save_attempt', function(req, res) {
    var seed = req.body.seed;
    var level = req.body.level;
    var username = req.session.user.username;

    var Solutions = Parse.Object.extend('Solutions');
    var sol = new Solutions();

    sol.set('user', username);
    sol.set('level', level);

    sol.set('initialScore', req.body.initialScore);
    sol.set('targetScore', req.body.targetScore);
    sol.set('leeway', req.body.leeway);

    sol.set('seed', seed);
    sol.set('type', req.body.type);
    sol.set('fake', req.body.fake);
    sol.set('isMobile', req.body.isMobile);


    sol.save(null, {
        success: function (gameScore) {


        },
        error: function (gameScore, error) {
            res.status(400).end();
        }
    });
});


app.post('/save_solution', function (req, res) {
    var Solutions = Parse.Object.extend('Solutions');
    var solutionsQuery = new Parse.Query(Solutions);
    solutionsQuery.descending('createdAt');
    solutionsQuery.equalTo('user', req.session.user.username);

    solutionsQuery.first({
        success: function (sol) {

            var solution = req.body.solution;
            var score = req.body.score;
            var seed = req.body.seed;
            var level = req.body.level;
            var username = req.session.user.username;

            sol.set('user', username);
            sol.set('solution', solution);
            sol.set('score', score);
            sol.set('level', level);
            sol.set('initialScore', req.body.initialScore);
            sol.set('targetScore', req.body.targetScore);
            sol.set('duration', req.body.duration);
            sol.set('seed', seed);
            sol.set('type', req.body.type);
            sol.set('fake', req.body.fake);
            sol.set('isMobile', req.body.isMobile);

            sol.save(null, {
                success: function (gameScore) {
                    // if (req.body.initialScore < req.body.score) {
                    var UserData = Parse.Object.extend('UserData');
                    var userDataQuery = new Parse.Query(UserData);
                    userDataQuery.equalTo('user', username);
                    userDataQuery.first({
                        success: function (user) {
                            // if (req.body.fake) {
                            //     user.set('overallScore', user.attributes.overallScore + req.body.score - req.body.initialScore);
                            // } else {
                            user.set('overallScore', (user.attributes.overallScore + req.body.score - req.body.initialScore));
                            // }

                            user.set('numSucAttempts', user.attributes.numSucAttempts + 1);
                            user.save(null, {
                                success: function (result) {
                                    res.status(200).end();
                                },
                                error: function (result, error) {
                                    res.status(400).end();
                                }
                            });

                        },
                        error: function (error) {
                            res.status(400).end();
                        }
                    });

                    // res.status(200).end();
                    // } else {
                    //     res.status(200).end();
                    // }


                },
                error: function (gameScore, error) {
                    res.status(400).end();
                }
            });


            solution.save(null, {
                success: function (data) {
                    res.status(200).end();
                },
                error: function (data, error) {
                    res.status(400).end();
                }
            });
        },
        error: function (error) {
            res.status(400).end();
        }
    });

});


app.get('/get_performance', function (req, res) {
    var nwm = 45952 + 136286 + 9582 + 9940;
    var levels = [1, 2, 3, 4];
    var result = {player: 0, hsim: 8360 + 13247 - 9940, allP: -nwm};

    var UserData = Parse.Object.extend('UserData');
    var userDataQuery = new Parse.Query(UserData);
    userDataQuery.equalTo('user', req.session.user.username);

    userDataQuery.first({
        success: function (user) {
            result.player = user.attributes.overallScore;

            async.each(levels, function(level, callback) {

                var Solutions = Parse.Object.extend('Solutions');
                var solutionsQuery = new Parse.Query(Solutions);
                solutionsQuery.equalTo('level', level);
                solutionsQuery.descending('score');

                solutionsQuery.first({
                    success: function (sol) {
                        result.allP = result.allP + sol.attributes.score;
                        callback();
                    },
                    error: function (error) {
                        res.status(400).end();
                    }
                });

            }, function(err) {
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    res.status(400).end();

                } else {
                    res.json(result);
                }
            });
        },
        error: function (error) {
            res.status(400).end();
        }
    });
});



app.get('/get_scoreboard', function (req, res) {
    var UserData = Parse.Object.extend('UserData');
    var userDataQuery = new Parse.Query(UserData);
    userDataQuery.descending('overallScore');

    userDataQuery.find({
        success: function (scores) {
            // Get data
            scores = scores.map(function (score) {
                return score.toJSON();
            });

            // Get overall score
            if (req.session.user) {
                var overallScore = 0;
                for (var i = 0; i < scores.length; i++) {
                    if (req.session.user.username == scores[i].user) {
                        overallScore = scores[i].overallScore;
                        break;
                    }
                }

                // Get rank
                var rank = 0;
                for (i = 0; i < scores.length; i++) {
                    rank++;
                    if (scores[i].overallScore == overallScore) {
                        break;
                    }
                }
                res.json({
                    scores: scores,
                    overallScore: overallScore,
                    rank: rank
                });
            } else {
                res.json({
                    scores: scores
                });
            }

        },
        error: function (error) {
            res.status(400).end();
        }
    });
});

app.post('/save_trace', function (req, res) {
    var Solutions = Parse.Object.extend('Traces');
    var sol = new Solutions();

            var solution = req.body.solution;
            var score = req.body.score;
            var seed = req.body.seed;
            var level = req.body.level;
            var username = req.session.user.username;

            sol.set('user', username);
            sol.set('solution', solution);
            sol.set('score', score);
            sol.set('level', level);
            sol.set('initialScore', req.body.initialScore);
            sol.set('targetScore', req.body.targetScore);
            sol.set('duration', req.body.duration);
            sol.set('seed', seed);
            sol.set('type', req.body.type);
            sol.set('fake', req.body.fake);
            sol.set('isMobile', req.body.isMobile);
            sol.set('trace', req.body.traces);

            sol.save(null, {
                success: function (gameScore) {
                    res.status(200).end();
                },
                error: function (gameScore, error) {
                    res.status(400).end();
                }
            });


            solution.save(null, {
                success: function (data) {
                    res.status(200).end();
                },
                error: function (data, error) {
                    res.status(400).end();
                }
            });

});


app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname+'/index.html'));
});


app.route('/*')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname+ '/index.html'));
    });
