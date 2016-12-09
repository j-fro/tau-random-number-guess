var maxNumberOptions = [];
var playerNumber = [];
var maxNumber;

$(document).ready(function() {
    init();
});

function init() {
    $('#setupScreen').hide();
    $('#gameScreen').hide();
    $('#endScreen').hide();
    enable();

} //end init

function enable() {
    $('#selectMaxNumberButton').on('click', clickedPlayerNumber);
    $('#startGameButton').on('click', clickedStart);
    $('#submitGuessButton').on('click', clickedSubmitGuesses);
    $('#abandonGameButton').on('click', clickedRestartGame);
    $(document).on('click', '#restartGameButton', clickedRestartGame);
} // end enable

function clickedPlayerNumber() {
    console.log("in clickedPlayerNumber");
    var numberOfPlayers = parseInt($('#numberOfPlayersIn').val());
    console.log("number of players", numberOfPlayers);
    if (numberOfPlayers > 0) {
        playerNumber = [];
        for (var i = 0; i < numberOfPlayers; i++) {
            playerNumber.push(i + 1);
        }
        maxNumberOptions = [];
        for (var j = 1; j < 1000; j *= 10) {
            maxNumberOptions.push(j * numberOfPlayers - 1);
            console.log(j);
        }
    }
    setupMaxNumberOptions();
}

function clickedStart() {
    $('#setupScreen').hide();
    $('#gameScreen').show();
    maxNumber = $('#maxNumberIn').val();
    $('#maxNumber').text('The number will be between 0 and  ' + maxNumber);
    setupGuessInput();
    console.log('maxNumber is:', maxNumber);
    $.ajax({
        url: '/start',
        type: 'POST',
        data: {
            maxNumber: maxNumber
        },
        success: function(response) {
            console.log('response from clickedStart:', response);
        },
        error: function() {
            console.log('DANGER!!! Error with ajax call...');
        }
    }); // end ajax
} // end clickedStart

function clickedRestartGame() {
    $('#playerSetupScreen').show();
    $('#setupScreen').hide();
    $('#gameScreen').hide();
    $('#endScreen').hide();
    maxNumberOptions = [];
    playerNumber = [];
}

function clickedSubmitGuesses() {
    console.log('clicked submit guesses');
    var valid = true;
    for (var i = 0; i < playerNumber.length; i++) {
        var guess = parseInt($('#player' + (playerNumber[i])).val());
        $('#errorPlayer' + playerNumber[i]).html('');
        if (isNaN(guess)) {
            valid = false;
            $('#errorPlayer' + playerNumber[i]).html('<p>Please Enter SOMETHING!</p>');
        }
        console.log('maxNumber and guess:', maxNumber, guess);
        if ( maxNumber < guess || guess < 0  ) {
            valid = false;
            $('#errorPlayer' + playerNumber[i]).html('<p>Please Enter something POSSIBLE! (between 0 and ' + maxNumber + ')</p>');
        }
    }// end for
    if (valid){submitGuesses();}
} // end clickedSubmitGuesses

function submitGuesses() {
    console.log('in submitGuesses');
    var objectToSend = {
        'guesses': []
    };
    for (var i = 0; i < playerNumber.length; i++) {
        var playerGuess = {
            'player': playerNumber[i],
            'guess': 0
        };
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
            displayResults(response);
        }
    }); // end ajax
} // end SubmitGuesses

function setupMaxNumberOptions() {
    console.log('in setupMaxNumberOptions');
    $('#playerSetupScreen').hide();
    $('#setupScreen').show();
    var outputHtml = '';
    for (var i = 0; i < maxNumberOptions.length; i++) {
        outputHtml += '<option>' + maxNumberOptions[i] + '</option>';
    } // for
    $('#maxNumberIn').html(outputHtml);
} // setupMaxNumberOptions

function setupGuessInput() {
    console.log('in setupGuessInput');
    var outputHtml = '';
    for (var i = 0; i < playerNumber.length; i++) {
        outputHtml += '<p>Player ' + playerNumber[i] + '</p>';
        outputHtml += '<div class="errorMessage" id="errorPlayer' + playerNumber[i] + '" ></div>';
        outputHtml += '<input class="playerInput" id="player' + playerNumber[i] + '" type="number">';
        outputHtml += '<p id="playerResults' + playerNumber[i] + '"></p>';
    } // end for
    $('#playerInputs').html(outputHtml);
} // end setupGuessInput


function displayResults(array) {
    $('#guessCount').text('Total Guesses made: ' + array[0].guessCount);
    var outputHtml = '';
    for (var i = 0; i < array.length; i++) {
        if (array[i].outcome === 'win') {
            displayWinner(array[i]);
            break;
        }
        outputHtml = 'Previous Guess: ' + array[i].outcome;
        $('#playerResults' + array[i].player).text(outputHtml);
    } //end for
} //end displayResults

function displayWinner(winnerObject) {
    console.log('in displayWinner', winnerObject);
    $('#gameScreen').hide();
    var outputHtml = '<h1>Player ' + winnerObject.player + ' Wins!!!</h1><h3>The winning guess: ' + winnerObject.guess + '</h3><h4>Total guesses made: ' + winnerObject.guessCount + '</h4>';
    outputHtml += '<button type="button" id="restartGameButton">Restart Game</button>';
    $('#endScreen').show();
    $('#endScreen').html(outputHtml);
} //end displayWinner









// get off my back!!!
