/**
 * Created by Christina on 2016-12-08.
 */

var app = angular.module('myApp', ['ui.router']);

app.directive('draggable', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var startX, startY, initialMouseX, initialMouseY;
            elm.css({position: 'absolute'});

            elm.bind('mousedown', function ($event) {
                startX = elm.prop('offsetLeft');
                startY = elm.prop('offsetTop');
                initialMouseX = $event.clientX;
                initialMouseY = $event.clientY;
                $document.bind('mousemove', mousemove);
                $document.bind('mouseup', mouseup);
                return false;
            });

            function mousemove($event) {
                var dx = $event.clientX - initialMouseX;
                var dy = $event.clientY - initialMouseY;
                elm.css({
                    top: startY + dy + 'px',
                    left: startX + dx + 'px'
                });
                return false;
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        }
    };
}]);


app.controller('mainCtrl', function ($scope, $state, $http) {
    var start2 = 1;

    $scope.cond = 3;


    var times = [];

    var files = {
        'images': {
            'animegirls': [
                {'path': 'assets/images/anime_girls/1.jpg', 'name': '1'},
                {'path': 'assets/images/anime_girls/2.jpg', 'name': '2'},
                {'path': 'assets/images/anime_girls/3.jpg', 'name': '3'},
                {'path': 'assets/images/anime_girls/4.jpg', 'name': '4'},
                {'path': 'assets/images/anime_girls/5.jpg', 'name': '5'},
                {'path': 'assets/images/anime_girls/6.jpg', 'name': '6'},
                {'path': 'assets/images/anime_girls/7.jpg', 'name': '7'},
                {'path': 'assets/images/anime_girls/8.jpg', 'name': '8'},
                {'path': 'assets/images/anime_girls/9.jpg', 'name': '9'},
                {'path': 'assets/images/anime_girls/10.jpg', 'name': '10'},
                {'path': 'assets/images/anime_girls/11.jpg', 'name': '11'},
                {'path': 'assets/images/anime_girls/12.jpg', 'name': '12'},
                {'path': 'assets/images/anime_girls/13.jpg', 'name': '13'},
                {'path': 'assets/images/anime_girls/14.jpg', 'name': '14'},
                {'path': 'assets/images/anime_girls/15.jpg', 'name': '15'},
                {'path': 'assets/images/anime_girls/16.jpg', 'name': '16'},
                {'path': 'assets/images/anime_girls/17.jpg', 'name': '17'},
                {'path': 'assets/images/anime_girls/18.jpg', 'name': '18'},
                {'path': 'assets/images/anime_girls/19.jpg', 'name': '19'},
                {'path': 'assets/images/anime_girls/20.jpg', 'name': '20'},
                {'path': 'assets/images/anime_girls/21.jpg', 'name': '21'},
                {'path': 'assets/images/anime_girls/22.jpg', 'name': '22'},
                {'path': 'assets/images/anime_girls/23.jpg', 'name': '23'},
                {'path': 'assets/images/anime_girls/24.jpg', 'name': '24'},
                {'path': 'assets/images/anime_girls/25.jpg', 'name': '25'}
            ]
        }
    };

    var traces = [];
    var powerpoint = {'selected': [], 'slides': []};
    var autopilot = {'suggest': null, 'macros': [], 'repthres': 1, 'mode': 'def', 'steps': [], 'macro_reps': {}};


    $scope.autopilot = autopilot;

    $scope.powerpoint = powerpoint;
    $scope.images = [];

    $scope.show = {'add-slide-app': false, 'powerpoint-app': false, 'documents-app': false, 'autopilot-app': false};


    $scope.toggleWindow = function (str) {
         $scope.show[str] = !$scope.show[str];
    };

    $scope.rename = function(val) {
        autopilot['macro_reps'][autopilot['selected']['name']] = autopilot['macro_reps'][val];

    };

    $scope.selectImage = function (id, remove, col) {

        img = {'path': 'assets/images/anime_girls/' + id + '.jpg', 'name': id};

        if ($('#' + img['name']).hasClass('gray') || $('#' + img['name']).hasClass('blue')) {
            $('#' + img['name']).toggleClass(col);

            for (var i = 0; i < powerpoint['selected'].length; i++) {
                if (powerpoint['selected'][i]['name'] == img['name']) {
                    powerpoint['selected'].splice(i, 1);
                }
            }

        } else {
            if (remove && powerpoint['selected'].length > 0) {
                $('#' + powerpoint['selected'][0]['name']).toggleClass(col);
                powerpoint['selected'][0] = img;
                $('#' + img['name']).toggleClass(col);

            } else {
                powerpoint['selected'].push(img);
                $('#' + img['name']).toggleClass(col);
            }
        }
    };

    // $scope.selectImage = function(id, remove) {
    //
    //     img = {'path': 'assets/images/anime_girls/' +  id + '.jpg', 'name':id};
    //
    //     if ($('#' + img['name']).hasClass('gray')) {
    //         $('#' + img['name']).toggleClass('gray');
    //
    //         for (var i = 0; i < powerpoint['selected'].length; i++) {
    //             if (powerpoint['selected'][i]['name'] == img['name']) {
    //                 powerpoint['selected'].splice(i, 1);
    //             }
    //         }
    //
    //     } else {
    //         if (remove && powerpoint['selected'].length > 0) {
    //             $('#' + powerpoint['selected'][0]['name']).toggleClass('gray');
    //             powerpoint['selected'][0] = img;
    //             $('#' + img['name']).toggleClass('gray');
    //
    //         } else {
    //             powerpoint['selected'].push(img);
    //             $('#' + img['name']).toggleClass('gray');
    //         }
    //     }
    // };

    $scope.record = function (event) {
        var start = (new Date()).getTime();

        var step = addStep(event);

        if (traces.length > 0) {
            step['ind'] = traces[traces.length - 1]['ind'] + 1;
        } else {
            step['ind'] = 0;
        }


        checkRepetitions();

        var shouldAuto = shouldAutomate();

        if (shouldAuto != -1) {
            $scope.toggleAutomationPrompt(shouldAuto);
            autopilot['macro_reps'][shouldAuto] = 0;
        } else {
        }


        if (autopilot['mode'] == 'sug_loop' || autopilot['mode'] == 'sug_noloop') {
            executeAction(event.currentTarget.id, false);
        } else {
            executeAction(event.currentTarget.id, true);
        }

        if (autopilot.mode == 'record' && event.currentTarget.id != "recorder") {

            autopilot['steps'].push(step);

            var scroll = document.getElementById('step-container');
            scroll.scrollTop = scroll.scrollHeight;
            scroll.animate({scrollTop: scroll.scrollHeight});

        }

        if (autopilot.mode != 'record') {
            traces.push(step);
        }


        // record elapsed time
        var temp = {'id': event.currentTarget.id, 'start': start, 'end': (new Date()).getTime()};
        times.push(temp);
    };

    var generalize = function (l) {
        var looping = false;
        for (var i = 0; i < l.length; i++) {
            if (l[i]['text'].includes('Click image')) {
                l[i]['text'] = l[i]['text'].substring(0, l[i]['text'].length - 2);
                looping = true;
                l[i]['img'] = 'https://cdn4.iconfinder.com/data/icons/flatified/512/photos.png';
            }
        }

        return {'looping': looping, 'list': l};
    };

    $scope.delete = function () {
        var macObj = getMacWithName(autopilot['selected']['name']);

        autopilot['macros'].splice(macObj, 1);

        executeAction('back', false);
    };

    $scope.saveRecording = function () {

        var steps = generalize(autopilot['steps']);


        var res = {
            'name': 'New_Macro_' + (new Date()).getTime(),
            'steps': steps['list'],
            'looping': steps['looping']
        };

        autopilot['macros'].unshift(res);
        autopilot['macro_reps'][res['name']] = 0;


        autopilot['macros'].sort(function (a, b) {
            // ASC  -> a.length - b.length
            // DESC -> b.length - a.length
            return b['steps'].length - a['steps'].length;
        });

        $scope.cancelRecording();
    };


    $scope.cancelRecording = function () {
        autopilot['steps'] = [];

        $scope.toggleRecording();
    };


    $scope.removeStep = function (index) {
        for (var i = 0; i < autopilot['steps'].length; i++) {
            if (autopilot['steps'][i]['ind'] == index) {
                autopilot['steps'].splice(i, 1);
                break;
            }
        }
    };

    $scope.removeStepInEdit = function (index) {
        for (var i = 0; i < autopilot['selected']['steps'].length; i++) {
            if (autopilot['selected']['steps'][i]['ind'] == index) {
                autopilot['selected']['steps'].splice(i, 1);
                break;
            }
        }
    };

    var addStep = function (event) {
        var res = {id: '', text: '', ind: 0, img: null};

        res['id'] = event.currentTarget.id;

        html2canvas($('#' + event.currentTarget.id), {
            onrendered: function (canvas) {
                res['img'] = canvas.toDataURL();

                $scope.$apply();
            }
        });


        if (event.currentTarget.nodeName == "IMG") {
            res['text'] = "Click image '" + res['id'] + "'";
        } else {
            res['text'] = "Click '" + res['id'].replace('-', ' ') + "'";
        }

        return res;

    };


    var executeAction = function (id, isMan) {
        switch (id) {
            case 'autopilot':
                autopilot['mode'] = 'def';
                $scope.toggleWindow('autopilot-app');
                break;
            case 'close-powerpoint':
                $scope.toggleWindow('powerpoint-app');
                break;
            case 'close-documents':
                $scope.toggleWindow('documents-app');
                break;
            case 'add-slide':
                $scope.toggleWindow('add-slide-app');
                break;
            case 'open-image':
                $scope.openImage();
                break;
            case 'cancel-image':
                $scope.toggleWindow('add-slide-app');
                break;
            case 'powerpoint':
                $scope.toggleWindow('powerpoint-app');
                break;
            case 'documents':
                $scope.toggleWindow('documents-app');
                break;
            case 'edit':
                $scope.toggleEdit();
            case 'recorder':
                $scope.toggleRecording();
                break;
            case 'yes-mac':
                $scope.runMac();
                break;
            case 'no-mac':
                $scope.back();
                break;
            case 'back':
                $scope.back();
                break;
            case 'save-record':
                $scope.saveRecording();
                break;
            case 'settings':
                console.log(times);
                break;
            case 'cancel-record':
                $scope.cancelRecording();
                break;
            default:

                var k = document.getElementById(id).nodeName;
                if (document.getElementById(id).nodeName == 'IMG') {
                    if (isMan) {
                        $scope.selectImage(id, isMan, 'gray');
                    } else {
                        $scope.selectImage(id, isMan, 'blue');

                    }
                } else if (id.includes('viewmacro_')) {
                    $scope.viewMacro(id);
                }

                break;
        }

        if (powerpoint.slides.length == $scope.images.length && times.length > 0) {
            //save
            $http.post("/save", {text: times});
            times = [];
        }

    };

    $scope.back = function () {
        autopilot['mode'] = 'def';
    };

    $scope.viewMacro = function (id) {
        autopilot['mode'] = 'mac';

        var name = id.split('viewmacro_')[1];
        for (var i = 0; i < autopilot['macros'].length; i++) {
            if (autopilot['macros'][i]['name'] == name) {
                autopilot['selected'] = autopilot['macros'][i];
            }
        }
    };


    $scope.play = function (mac) {
        start2 = 1;


        $scope.executeAction('add-slide-app', false);

        $scope.executeAction('powerpoint-app', false);


        autopilot['suggest'] = mac;
        autopilot['macro_reps'][mac['name']] = 0;
        traces = [];

        $scope.toggleAutomationPrompt(mac['name']);
    };

    $scope.runMac = function () {
        autopilot['mode'] = 'run';

        setTimeout(function () {
            autopilot['mode'] = 'def';
            $scope.$apply();
        }, 1000);

        // if (autopilot['suggest']['looping'] == false) {
        for (var i = start2; i < autopilot['suggest']['steps'].length; i++) {

            if (autopilot['suggest']['steps'][i]['text'].includes('Click image')) {
                continue;
            }

            executeAction(autopilot['suggest']['steps'][i]['id'], false);
        }


        // } else {
        //     $scope.im = [];
        //
        //     for (var i = 0; i <= powerpoint.selected.length; i++) {
        //         for (var j = 0; j < autopilot['suggest']['steps'].length; j ++) {
        //             if (autopilot['suggest']['steps'][i]['text'].contains('Click image')) {
        //                 executeAction(autopilot['suggest']['steps'][j]['id'], false);
        //
        //             } else {
        //                 executeAction(autopilot['suggest']['steps'][j]['id'], false);
        //
        //             }
        //         }
        //
        //         autoSelectImage(i.toString, false);
        //     }

        start2 = 1;
    };

    $scope.toggleEdit = function () {

    };

    $scope.toggleRecording = function () {
        if (autopilot.mode == 'record') {
            autopilot.mode = 'def';

            $('#recorder').css('cursor', 'pointer');
            $('#edit').css('cursor', 'pointer');

            $('#recorder').toggleClass('animate-flicker');
        } else {

            autopilot.mode = 'record';

            $('#recorder').css('cursor', 'not-allowed');
            $('#edit').css('cursor', 'not-allowed');

            $('#recorder').toggleClass('animate-flicker');
        }


    };

    var checkRepetitions = function () {
        for (var i = 0; i < autopilot['macros'].length; i++) {
            for (var j = 0; j < traces.length; j++) {

                if (isSequence(traces, autopilot['macros'][i]['steps'], j)) {
                    autopilot['macro_reps'][autopilot['macros'][i]['name']] += 1;
                    resetTraces();
                }
            }
        }
    };


    var shouldAutomate = function () {
        for (var i in autopilot['macro_reps']) {
            if (autopilot['macro_reps'][i] >= autopilot['repthres']) {
               return i;
            }
        }

        return -1;
    };

    function getMacWithName(mac) {
        for (var i = 0; i < autopilot['macros'].length; i++) {
            if (autopilot['macros'][i]['name'] == mac) {
                return i;
            }
        }
    }


    $scope.toggleAutomationPrompt = function (mac) {

        $scope.show['autopilot-app'] = true;

        var macObj = autopilot['macros'][getMacWithName(mac)];

        autopilot['suggest'] = macObj;

        if (macObj['looping']) {
            autopilot['mode'] = 'sug_loop';

            for (var i = 0; i < $scope.images.length; i++) {

                // check if image is already in the powerpoint slides
                var present = false;
                for (var j = 0; j < powerpoint.slides.length; j++) {
                    if ($scope.images[i]['name'] == powerpoint.slides[j]['name']) {
                        present = true;
                    }
                }

                if (!present) {
                    $scope.selectImage((i + 1).toString(), false, 'blue');

                }



            }

        } else {
            autopilot['mode'] = 'sug_noloop';
        }


    };

    var resetTraces = function () {
        traces = [];
    };

    var isSequence = function (list, seq, i) {
        // if (list.length < seq.length) {
        //     return false;
        // }


        for (var j = 0; j < seq.length; j++) {
            if (list[i + j] && list[i + j]['text'] == seq[j]['text']) {

            } else if (list[i + j] && list[i + j]['text'].includes('Click image') && seq[j]['text'].includes('Click image')) {

            } else {
                return false;
            }

        }

        return true;

    };


    $scope.openImage = function () {

        powerpoint['slides'].push.apply(powerpoint['slides'], powerpoint['selected']);

        for (var i = 0; i < powerpoint['selected'].length; i++) {
            $('#' + powerpoint['selected'][i]['name']).removeClass('gray');
            $('#' + powerpoint['selected'][i]['name']).removeClass('blue');

        }

        powerpoint['selected'] = [];

        $scope.show['add-slide-app'] = false;

    };


    var populate = function (ele, obj) {

        for (var i = 0; i < $scope.cond; i++) {
            ele.push(obj[i]);
        }
    };

    $scope.updateImages = function () {

        powerpoint.selected = [];
        powerpoint.slides = [];


        $scope.images = [];

        populate($scope.images, files['images']['animegirls']);
    };


///

    $scope.updateImages();


})
;
