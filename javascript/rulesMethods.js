
// Get the dialog
var dialogRules = document.getElementById('dialogRules');

// Get the button that opens the modal
var btnRules = document.getElementById("btnRules");

// Get the <span> element that closes the modal
var btnCloseRules = document.getElementById("btnCloseRules");

// When the user clicks the button, open the modal
btnRules.onclick = function() {
    dialogRules.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
btnCloseRules.onclick = function() {
    dialogRules.style.display = "none";
}
