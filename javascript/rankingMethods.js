
// Get the dialog
var dialogRanking = document.getElementById('dialogRanking');

// Get the button that opens the modal
var btnRanking = document.getElementById('btnRanking');

// Get the <span> element that closes the modal
var btnCloseRanking = document.getElementById('btnCloseRanking');

// When the user clicks the button, open the modal
btnRanking.onclick = function() {
    dialogRanking.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
btnCloseRanking.onclick = function() {
    dialogRanking.style.display = "none";
};

var tableRanking = document.getElementById("tableRanking");
var indexRanking = 0;
var rankingList = [];
function insertNewGame(player, moves) {
    indexRanking = getRankingIndex(moves);
    var row = tableRanking.insertRow(indexRanking);

    var cellPlayer = row.insertCell(0);
    var cellMoves = row.insertCell(1);
    cellPlayer.innerHTML = player;
    cellMoves.innerHTML = moves;

    rankingList.push(moves);
    rankingList.sort();
}

function getRankingIndex(moves) {
    for (var i = 0; i < rankingList.length; i++) {
        if(moves <= rankingList[i]){
            return i+1;
        }

    }
    return rankingList.length+1;
}

