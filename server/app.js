var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var port = process.env.PORT || 3003;
// app.use(bodyParser.urlencoded({extended: false}));
// Set up body parsing
app.use(bodyParser.json());

var maxNumber;
var randomNumber;
var guessedNumbers;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.post('/start', function(req, res) {
    console.log('Starting game', req.body);
    maxNumber = req.body.maxNumber;
    randomNumber = generateRandomNumber(maxNumber);
    console.log("Random number: ", randomNumber);
    res.send('OK');
});

app.post('/guess', function(req, res) {
    console.log('Received guesses:', req.body);
});

app.listen(port, function() {
    console.log('Listening on ' + port);
});

function generateRandomNumber(maxNumber) {
    return parseInt((Math.random() * (maxNumber + 1)));
}




// Expose public folder
app.use(express.static('public'));