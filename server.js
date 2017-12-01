var express = require('express');
var app = express();
var path = require('path');
var _ = require('lodash');
var bodyParser = require('body-parser');
var session = require('express-session');
var async = require('async');
var fs = require("fs");


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


app.post('/save', function(req, res) {

    fs.appendFile('1.txt', JSON.stringify(req.body.text) + '\n');

    res.send(200).end();

});



app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname+'/index.html'));
});


app.route('/*')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname+ '/index.html'));
    });
