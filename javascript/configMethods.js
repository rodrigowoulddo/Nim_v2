
// Get the dialog
var dialogConfig = document.getElementById('dialogConfig');

// Get the button that opens the modal
var btnConfig = document.getElementById("btnConfig");

// Get the <span> element that closes the modal
var btnCloseConfig = document.getElementById("btnCloseConfig");

// When the user clicks the button, open the modal
btnConfig.onclick = function() {
    dialogConfig.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
btnCloseConfig.onclick = function() {
    dialogConfig.style.display = "none";
};


/*Defines the clicks that change the board size*/
var radio3piles = document.getElementById('radio3piles');
var radio4piles = document.getElementById('radio4piles');
var radio5piles = document.getElementById('radio5piles');

var pile1 = document.getElementById("pile1");
var pile2 = document.getElementById("pile2");
var pile3 = document.getElementById("pile3");
var pile4 = document.getElementById("pile4");
var pile5 = document.getElementById("pile5");

var numberOfPiles = 3; /*Defines the global variable for the number of Piles*/

radio3piles.onclick = function () {
    pile1.style.display= 'block';
    pile2.style.display= 'block';
    pile3.style.display= 'block';
    pile4.style.display= 'none';
    pile5.style.display= 'none';
    numberOfPiles = 3;
};

radio4piles.onclick = function () {
    pile1.style.display= 'block';
    pile2.style.display= 'block';
    pile3.style.display= 'block';
    pile4.style.display= 'block';
    pile5.style.display= 'none';
    numberOfPiles = 4;
};

radio5piles.onclick = function () {
    pile1.style.display= 'block';
    pile2.style.display= 'block';
    pile3.style.display= 'block';
    pile4.style.display= 'block';
    pile5.style.display= 'block';
    numberOfPiles = 5;
};


/*Defines first player*/
var radioYouPlayer = document.getElementById('radioYouPlayer');
var radioCpuPlayer = document.getElementById('radioCpuPlayer');

radioYouPlayer.onclick = function () {
    defaultplayer = "you";
};

radioCpuPlayer.onclick = function () {
    defaultplayer = "cpu";
};


/*Defines dificulty*/
var radioEasy = document.getElementById('radioEasy');
var radioMedium = document.getElementById('radioMedium');
var radioHard = document.getElementById('radioHard');

radioEasy.onclick = function () {
    /*not yet implemented*/
};

radioMedium.onclick = function () {
    /*not yet implemented*/
};

radioHard.onclick = function () {
    /*not yet implemented*/
};
