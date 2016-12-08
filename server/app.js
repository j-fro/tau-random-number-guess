var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var port = process.env.PORT || 3003;

app.listen(port, function() {
    console.log('Listening on ' + port);
});

// Set up body parsing
app.use(bodyParser.urlencoded({extended: false}));
// Expose public folder
app.use(express.static('public'));
