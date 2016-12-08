var maxNumberOptions = [3, 30, 300, 3000];
var playerNumber = [0, 1, 2, 3];

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
        outputHtml += '<p>Player ' + (i+1) + '</p>';
        outputHtml += '<input class="playerInput" data-player="' + (i+1) + '" type="number">';
    } // end for
    console.log(outputHtml);
    $('#playerInputs').html(outputHtml);
} // end setupGuessInput





























// get off my back!!!
