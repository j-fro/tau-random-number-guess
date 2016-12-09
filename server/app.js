var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var port = process.env.PORT || 3003;
app.use(bodyParser.urlencoded({extended: true}));
// Set up body parsing
// app.use(bodyParser.json());

var maxNumber;
var randomNumber;
var guessedNumbers;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.post('/start', function(req, res) {
    console.log('Starting game', req.body);
    maxNumber = req.body.maxNumber;
    console.log('maxNumber is:', maxNumber);
    randomNumber = generateRandomNumber(maxNumber);
    console.log("Random number: ", randomNumber);
    res.sendStatus(200);
});

app.post('/guess', function(req, res) {
    console.log('Received guesses:', req.body);
    res.send(test(req.body.guesses));
});

app.listen(port, function() {
    console.log('Listening on ' + port);
});

function generateRandomNumber(maxNumber) {
    return parseInt((Math.random() * (parseInt(maxNumber) + 1)));
}

function test(array) {
    for (var i = 0; i < array.length; i++) {
        if (parseInt(array[i].guess) < randomNumber) {
            array[i].outcome = 'low';
        } else if (parseInt(array[i].guess) > randomNumber) {
            array[i].outcome = 'high';
        } else if (parseInt(array[i].guess) === randomNumber) {
            array[i].outcome = 'win';
        } else {
            array[i].outcome = 'you broke it asshole';
        }
    }
    return array;
}

// Expose public folder
app.use(express.static('public'));
