var maxNumberOptions = [3, 30, 300, 3000];
var playerNumber = [1, 2, 3];

$(document).ready(function(){
    init();
});

function init(){
    setupMaxNumberOptions();
    enable();
    setupGuessInput();
} //end init

function enable(){
    $('#startGameButton').on('click', clickedStart);
    $('#submitGuessButton').on('click', clickedSubmitGuesses);
} // end enable



function clickedStart(){
    var maxNumber = $('#maxNumberIn').val();
    console.log('maxNumber is:', maxNumber);
    $.ajax({
        url: '/start',
        type: 'POST',
        data: {maxNumber: maxNumber},
        success: function(response) {
            console.log('response from clickedStart:',response);
        },
        error: function() {
            console.log('DANGER!!! Error with ajax call...');
        }
    }); // end ajax
} // end clickedStart

function setupMaxNumberOptions(){
    console.log('in setupMaxNumberOptions');
    var outputHtml = '';
    for (var i = 0; i < maxNumberOptions.length; i++) {
        outputHtml += '<option>' + maxNumberOptions[i] + '</option>';
    } // for
    $('#maxNumberIn').html(outputHtml);
} // setupMaxNumberOptions

function setupGuessInput(){
    console.log('in setupGuessInput');
    var outputHtml = '';
    for (var i = 0; i < playerNumber.length; i++) {
        outputHtml += '<p>Player ' + playerNumber[i] + '</p>';
        outputHtml += '<input class="playerInput" id="player' + playerNumber[i] + '" type="number">';
    } // end for
    $('#playerInputs').html(outputHtml);
} // end setupGuessInput

function clickedSubmitGuesses() {
    console.log('clicked submit guesses');
    var objectToSend = {
        'guesses': []
    };
    for (var i = 0; i < playerNumber.length; i++) {
        var playerGuess = { 'player': playerNumber[i] , 'guess': 0 };
        playerGuess.guess = parseInt($('#player' + (playerNumber[i])).val());
        objectToSend.guesses.push(playerGuess);
    }
    console.log(objectToSend);
    $.ajax({
        url: '/guess',
        type: 'POST',
        // contentType: 'application/json',
        data: objectToSend,
        success: function(response) {
            console.log('Sucess from server: ', response);
        }
    });
}



























// get off my back!!!
