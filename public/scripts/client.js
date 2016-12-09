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
    /* Wires up button handlers */
    $('#selectMaxNumberButton').on('click', clickedPlayerNumber);
    $('#startGameButton').on('click', clickedStart);
    $('#submitGuessButton').on('click', clickedSubmitGuesses);
    $('#abandonGameButton').on('click', clickedRestartGame);
    $(document).on('click', '#restartGameButton', clickedRestartGame);
} // end enable

function clickedPlayerNumber() {
    /* Sets the player variables and allowed maximums */
    console.log("in clickedPlayerNumber");
    $('#errorNoPlayers').text('');
    var numberOfPlayers = parseInt($('#numberOfPlayersIn').val());
    console.log("number of players", numberOfPlayers);
    if (numberOfPlayers <= 0 || isNaN(numberOfPlayers)) {
        $('#numberOfPlayersIn').val('');
        $('#errorNoPlayers').text('Enter a valid number of players!');
        return;
    } else {
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
    /* Sends the chosen maximum to the server and starts the game phase */
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
    /* Resets the game to initial conditions */
    $('#playerSetupScreen').show();
    $('#setupScreen').hide();
    $('#gameScreen').hide();
    $('#endScreen').hide();
    maxNumberOptions = [];
    playerNumber = [];
}

function clickedSubmitGuesses() {
    /* Gets user guess input, validates the guesses, then submits to the server */
    console.log("clicked submit");
    var guessesObject = getGuesses();
    console.log("guesses", guessesObject);
    if(validateGuesses(guessesObject.guesses)) {
        submitGuesses(guessesObject);
    }
}

function getGuesses() {
    /* Gets user input and returns an object with an array of player guesses */
    var guessesObject = {
        'guesses': []
    };
    for (var i = 0; i < playerNumber.length; i++) {
        var playerGuess = {
            'player': playerNumber[i],
            'guess': 0
        };
        // Gets the current player's guess and converts to integer
        playerGuess.guess = parseInt($('#player' + (playerNumber[i])).val());
        guessesObject.guesses.push(playerGuess);
    }
    return guessesObject;
}

function validateGuesses(guessesArray) {
    /* Validates each guess. If there are any issues with any guess, returns
    false */
    console.log('validating guesses');
    var valid = true;
    for (var i = 0; i < guessesArray.length; i++) {
        var guess = guessesArray[i].guess;
        console.log("current guess", guess);
        $playerError = $('#errorPlayer' + guessesArray[i].player);
        $playerError.html('');
        if (isNaN(guess)) {
            valid = false;
            $playerError.html('<p>Please Enter SOMETHING!</p>');
        }
        console.log('maxNumber and guess:', maxNumber, guess);
        if (maxNumber < guess || guess < 0) {
            valid = false;
            $playerError.html('<p>Please Enter something POSSIBLE! (between 0 and ' + maxNumber + ')</p>');
        }
    } // end for
    return valid;
}

function submitGuesses(objectToSend) {
    /* Sends the guesses object to the server and displays the results */
    $.ajax({
        url: '/guess',
        type: 'POST',
        data: objectToSend,
        success: function(response) {
            console.log('Sucess from server: ', response);
            displayResults(response);
        }
    });
}

function setupMaxNumberOptions() {
    /* Creates and displays select options based on the maximum numbers */
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
    /* Creates and displays guess inputs boxes for each player */
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
    /* Updates the results in line based on the server response */
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
    /* Shows the winner of the game */
    console.log('in displayWinner', winnerObject);
    $('#gameScreen').hide();
    var outputHtml = '<h1>Player ' + winnerObject.player + ' Wins!!!</h1><h3>The winning guess: ' + winnerObject.guess + '</h3><h4>Total guesses made: ' + winnerObject.guessCount + '</h4>';
    outputHtml += '<button type="button" id="restartGameButton">Restart Game</button>';
    $('#endScreen').show();
    $('#endScreen').html(outputHtml);
} //end displayWinner







// get off my back!!!
