$(document).ready(function(){
    init();
});

function init(){
    setupMaxNumberOptions();
    enable();
}

function enable(){
    $('#startGameButton').on('click', clickedStart);
}

function setupMaxNumberOptions(){
    console.log('in setupMaxNumberOptions');
}
