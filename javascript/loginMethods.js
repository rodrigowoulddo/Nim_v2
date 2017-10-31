
// Get the dialog
var dialogLogin = document.getElementById('dialogLogin');

// Get the button that opens the modal
var btnLogin = document.getElementById("btnLogin");

// Get the <span> element that closes the modal
var btnCloseLogin = document.getElementById("btnCloseLogin");

// When the user clicks the button, open the modal
btnLogin.onclick = function() {
    dialogLogin.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
btnCloseLogin.onclick = function() {
    dialogLogin.style.display = "none";
}
