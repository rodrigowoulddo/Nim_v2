/*COMMON ELEMENTS*/
var board = document.getElementById("divBoard");
var txtMessege = document.getElementById("txtMessage");
var defaultplayer = "you";
var playercounter = 0;
var cpucounter = 0;
var player = defaultplayer;

/*COMMANDS*/
var playables = document.getElementsByClassName('playable');
for (var i = 0; i < playables.length; i++) {
    var checkbox = playables[i];
    checkbox.onclick = function () {
        /*makes the checkbox uncheackble but not cheackble again*/
        if (this.checked)
            return false;

        /*Make chackbox uncheck the checkboxes above it*/
        checkboxPosition = getCheckboxPosition(this);
        var checkboxes = getAllBrothers(this);
        for (var i = checkboxPosition; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }

        play(); /*Make the move*/

    };
}


function getAllBrothers(checkbox){
    var pile = checkbox.parentElement;
    return checkboxes = pile.children;
}

function getCheckboxPosition(checkbox){
    var checkboxes = getAllBrothers(checkbox);

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].name == checkbox.name) {
            return i;
        }
    }
}


/*PREDEFINED FUNCTIONS*/
function makeBoard(){
    if(numberOfPiles >= 3) {
        fillPileRndom(pile1);
        fillPileRndom(pile2);
        fillPileRndom(pile3);
        // alert("Piles 1-3 filled"); /*DEBUG*/
    }
    if(numberOfPiles >= 4) {
        fillPileRndom(pile4);
        // alert("Pile 4 filled"); /*DEBUG*/
    }
    if(numberOfPiles >= 5) {
        fillPileRndom(pile5);
        // alert("Pile 5 filled"); /*DEBUG*/
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillPileRndom(pile){
    var checkboxes = pile.children;
    var numberOfChecked = getRandomInt(2,checkboxes.length);
    for (var i = 0; i < numberOfChecked; i++) {
        checkboxes[i].checked = true;
    }
}

/*when you click start, you cant login or change the config anymore*/
var btnStart = document.getElementById('btnStart');
btnStart.onclick = function () {
    makeBoard();
    btnLogin.setAttribute("disabled", true);
    btnConfig.setAttribute("disabled", true);
    btnStart.setAttribute("disabled", true);
    dialogConfig.style.display = "none";

    player = defaultplayer; /*default, starts with player*/

    /*shows who plays first*/
    if(player == "cpu"){
        txtMessege.innerHTML = "Computer's turn!";
        txtMessege.style.color = "red";
        setTimeout(makeRandomPlay,2000);
    }else if (player == "you"){
        unblockboard();
        txtMessege.innerHTML = "Your turn!";
        txtMessege.style.color = "green";
    }
};


/*MOVES********/

var playableCbx;
var indexOfPlayCbx;


function play() {

    if(player == "you"){
    playercounter++;

        /*COMPUTER MOVE*/
        player = "cpu";

        blockboard();

        /*Check if you won*/
        getPlayableCbx();
        if(playableCbx.length <= 0){
            /*show message that you won*/
            restartgame("You",playercounter);
            return; /*ends the game*/

        }else{
            /*show message of computer's turn*/
            txtMessege.innerHTML = "Computer's turn!";
            txtMessege.style.color = "red";
        }


        setTimeout(makeRandomPlay,2000); /*wait 2 seconds*/
        /*the rest of the steps are defined nside makeRandomPlay function*/

            }else{
        player = "you";
    }

}

function makeRandomPlay(){
    cpucounter++;

getPlayableCbx();
// alert("Number of playable checkboxes is "+playableCbx.length); /*DEBUG*/
    if(playableCbx.length > 0){
         indexOfPlayCbx = getRandomInt(0,playableCbx.length-1);
        playableCbx[indexOfPlayCbx].click();
    }

    /*Check if cpu won*/
    getPlayableCbx();
    if(playableCbx.length <= 0){
        /*show message that you won*/
        txtMessege.style.color = "red";
        restartgame("CPU",cpucounter);
        return; /*ends the game*/

    }else {
        unblockboard();
        /*show message of your turn*/
        txtMessege.innerHTML = "Your turn!";
        txtMessege.style.color = "green";
    }
}

function getPlayableCbx(){
    playableCbx = [];
    var piles = document.getElementsByClassName('pile');
    // alert("Te board has "+piles.length+" pile(s)"); /*DEBUG*/
    for (var i = 0; i < piles.length; i++) {
        var checkboxes = piles[i].children;
        // alert("Pile "+i+" has "+checkboxes.length+" checkboxes."); /*DEBUG*/
        for (var j = 0; j < checkboxes.length; j++) {
            // alert("looking checkbox nº "+j); /*DEBUG*/
            if(checkboxes[j].checked){
                // alert("checkbox "+j+" is checked"); /*DEBUG*/
                playableCbx.push(checkboxes[j])
            }
        }
    }
}

/*Restart the page and inserts winner on ranking*/

function restartgame(player,counter){

    // alert('Game restarted!!'); /*debug*/
    playercounter = 0;
    cpucounter = 0;

    btnLogin.removeAttribute("disabled");
    btnConfig.removeAttribute("disabled");
    btnStart.removeAttribute("disabled");

    txtMessege.innerHTML = "Player: "+"'"+player+"'"+" won with "+counter+" moves!";

    /*changes color acording to winner*/
    if(player == "You")
        txtMessege.style.color = "green";
    else
        txtMessege.style.color = "red";

    /*insert last result on ranking*/
    insertNewGame(player,counter); /*defined at ranking methods*/
}

function unblockboard() {
    board.style.pointerEvents = "all";
}

function  blockboard() {
    board.style.pointerEvents = "none";
}




