
/****** CLASSES *****************************/

const COMPLETE_REQUEST = 4;
const STATUS_COMPLETE = 200;
const HOST = "twserver.alunos.dcc.fc.up.pt";
const PORT = "8008";
class Server{

    constructor(){
    }

    static executeRequest(httpMethod, service, data, executedFunction, executedFunctionError, executedListener){
        let xhr = new XMLHttpRequest();
        xhr.open(httpMethod,"http://"+HOST+":"+PORT+"/"+service,true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === COMPLETE_REQUEST && xhr.status === STATUS_COMPLETE) {
                let response = JSON.parse(xhr.responseText);
                console.log(response);
                executedFunction(response);
            }else{
                if(xhr.status !== STATUS_COMPLETE)
                    executedFunctionError(xhr.responseText);

                if(xhr.responseText !== null && xhr.responseText!== "" && xhr.responseText !== "{}" && executedListener !== null)
                    executedListener(Util.getLastLine(xhr.responseText));
            }
        };

        xhr.send(data);
    }

    static executeRequestNoFunc(httpMethod, service, data){
        let xhr = new XMLHttpRequest();
        xhr.open(httpMethod,"http://"+HOST+":"+PORT+"/"+service,true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === COMPLETE_REQUEST && xhr.status === STATUS_COMPLETE) {
                let response = JSON.parse(xhr.responseText);
                console.log(response);
            }
        };
        xhr.send(data);
    }
}

class Messeger{
    constructor(){
        this.element = document.getElementById('txtMessage');
    }

    showGreenMessege(messege){
        this.element.style.backgroundColor = "green";
        this.element.innerHTML = messege;
    }

    showRedMessege(messege){
        this.element.style.backgroundColor = "red";
        this.element.innerHTML = messege;
    }

    clearMessege(){
        this.element.innerHTML = "";
        this.element.style.display = "none";

    }
}

class Game{

    constructor(){
        const self = this;
        this.id = "";
        this.numberOfPiles = 0;
        this.dificulty = 0;
        this.Player1Counter = 0;
        this.Player2Counter = 0;
        this.firstPlayer = 1;
        this.piles = [];
        this.messeger = new Messeger();

        this.element = document.getElementById('board');
    }

    gameOver(){
        for(let i = 0; i < this.piles.length; i++)
            if(!this.piles[i].emptyPile())
                return false;

        return true
    }

    checkForWinner(){
        if(this.gameOver()){

            /*TODO: Implement the players*/
            this.messeger.showGreenMessege("You won!! :D");
        }
    }

    createBoard(){
        for(let i = 0; i < this.numberOfPiles; i++){

            /*create pile dinamicaly and inserts on board*/
            const pile = new Pile('pile'+i, this);

            for(let i2 = 0; i2 < 8; i2++){  /*each pile has 8 slots for playables*/
                const playable = new Playable('playablei'+i+'_'+i2, pile);
                pile.playables.push(playable);
                pile.element.appendChild(playable.element); /*appends the HTML playable to the pile*/
            }

            this.piles.push(pile);
            this.element.appendChild(pile.element); /*appends the HTML pile to the board*/
        }
    }

    waitForStart(){
        Server.executeRequest("GET", "update?nick="+game.user.nick+"&"+"game="+this.id, null, this.startGame, this.showStartError, this.updateGame);
    }

    startGame(responseJSON){

    }

    showStartError(msg){

    }

    updateGame(responseJSON){

        console.log(Util.getLastLine(responseJSON).substring(5));
        let state = JSON.parse(Util.getLastLine(responseJSON).substring(5));
        console.log(state.turn+"'s turn - "+"Board is now: "+state.rack);

    }

    updateBoard(rack){
        console.log("new board is now: rack");
    }

    win(nick){
        console.log("winner is "+nick);
    }

    cancelWait(responseJSON){
        let leave = new Leave();
        leave.nick = user.nick;
        leave.pass = user.pass;
        leave.game = game.id;

        Server.executeRequest("POST", "leave", JSON.stringify(leave), this.cancelWait, Game.showCancelError, null);

        /*habilitar / desabilitar botoes*/
    }

    static showCancelError(msg){
        game.messeger.showRedMessege("Cancel error - "+msg);
    }

    leave(){

    }

}

class Pile{
    constructor(id, gameFather){
        const self = this;
        this.gameFather = gameFather;
        this.playables = [];
        this.element = document.createElement('div');
        this.element.id = id;
        this.element.className = 'pile';
    }

    emptyPile(){
        for(let i = 0; i < this.playables.length; i++)
            if(this.playables[i].state)
                return false;

        return true;
    }
}

class Playable {
    constructor(id, pileFather) {
        const self = this;
        this.pileFather = pileFather;
        this.state = true;
        /*creates the HTML element*/
        this.element = document.createElement('div');
        this.element.id = id;
        this.element.className = 'playable';
        this.element.onclick = function () {
            self.playableClick();
        };
    }

    removePlayable(){
        this.state = false;
        this.blockElement();
    }
    blockElement(){
        this.element.style.background = "darkkhaki";
        this.element.style.pointerEvents = "none";
        this.element.style.border = "none";
        this.element.style.margin = "4px"; /*so the border doesnt make diference*/
    }

    romoveAllAbove(){
        let playableBrothers = this.pileFather.playables;

        for(let i = 0; i < playableBrothers.length; i++){
            if(playableBrothers[i].element.id === this.element.id) {
                for (let j = i-1; j >= 0; j--) {
                    playableBrothers[j].removePlayable();
                }
            }
        }
    }
    playableClick(){
        this.removePlayable();
        this.romoveAllAbove();
        // game.checkForWinner();
        this.pileFather.gameFather.checkForWinner();
    }
}

class Window{

    constructor(type){
        const self = this;
        this.element = document.getElementById('dialog'+type);
        this.btnClose = document.getElementById('btnClose'+type);
        this.btnOpen = document.getElementById('btn'+type);

        this.btnClose.onclick = function () {
            self.disapear();
        };

        this.btnOpen.onclick = function () {
            self.show();
        };


        /*Ranking*/
        if(type === "Ranking"){
            this.tableRanking = document.getElementById("tableRanking");
            Window.updateRaanking();
        }

        /*Login*/
        if(type === "Login") {
            this.btnDoLogin = document.getElementById("btnDoLogin");
            this.txtNick = document.getElementById("txtNick");
            this.txtPass = document.getElementById("txtPass");

            this.btnDoLogin.onclick = function () {
                self.login();
            };
        }

        /*Config*/

        /*Rules*/
    }

    show(){
        Window.closeAllWindows();
        this.apear();
    }

    static closeAllWindows() {

        try {
            loginWindow.disapear();
        }catch(err){}
        try {
            rulesWindow.disapear();
        }catch(err){}
        try {
            rankingWindow.disapear();
        }catch(err){}
        try {
            configWindow.disapear();
        }catch(err){}
    }

    disapear(){
        this.element.style.display = 'none';
    }

    apear(){
        this.element.style.display = 'block'
    }

    login(){

        let join = new Join();
        join.group = 1983;
        join.nick = this.txtNick.value;
        join.pass = this.txtPass.value;
        join.size = game.numberOfPiles;

        game.user = new User(join.nick, join.pass);

        Server.executeRequest("POST","join", JSON.stringify(join), Window.makeLogin, Window.showLoginError, null);
    }

    static makeLogin(gameIdJSON){
        game.messeger.clearMessege();
        game.id = gameIdJSON.game;

        /*block login button*/
        loginWindow.btnOpen.disabled = true;

        /*unblock start and reset*/
        btnStart.disabled = false;
        btnLeave.disabled = false;

    }

    static showLoginError(msg){
        game.messeger.showRedMessege("Login Failed - "+msg);
    }

    static updateRaanking(){
        Window.clearTableRankingRows();

        let ranking = new Ranking;
        ranking.size = 3;

        Server.executeRequest("POST","ranking",JSON.stringify(ranking), Window.fillRanking, Window.showRankingError, null);
    }

    static fillRanking(rankingJSON){
        game.messeger.clearMessege();
        let rankingList = rankingJSON.ranking;

        for(let i = 0; i < rankingList.length; i=i+1){
            if(i < 10){
                let nick = rankingList[i].nick;
                let victories = rankingList[i].victories;
                let games = rankingList[i].games;

                Window.insertRowOnRanking(i+1,nick,victories,games);
            }
        }
    }

    static showRankingError(msg){
        game.messeger.showRedMessege("Ranking load Failed - "+msg);
    }

    static insertRowOnRanking(index,nick, victories, games){
        let row = tableRanking.insertRow(index);
        row.className = 'normal-text';

        let cellNick = row.insertCell(0);
        let cellVictories = row.insertCell(1);
        let cellGames = row.insertCell(2);
        cellNick.innerHTML = nick;
        cellVictories.innerHTML = victories;
        cellGames.innerHTML = games;
    }

    static clearTableRankingRows(){
        let rows = tableRanking.rows;
        let i = rows.length;
        while (--i) {
            tableRanking.deleteRow(i);
        }
    }
}

class Ranking{

}

class Join{

}

class Leave{

}

class User{
    constructor(nick,pass){
        this.nick = nick;
        this.pass = pass;
    }
}



/****** UTIL *****************************/
class Util{
    static getLastLine(text){
        try{
            if(text.lastIndexOf("\n")>0) {
                return text.substring(0, text.lastIndexOf("\n"));
            } else {
                return text;
            }
        }catch(err){return text}
    }
}


/****** GLOBAL *****************************/
let game = new Game();
game.numberOfPiles = 3;
game.createBoard();
let rankingWindow = new Window("Ranking");
let loginWindow = new Window("Login");
let rulesWindow = new Window("Rules");
let configWindow = new Window("Config");

let btnStart = document.getElementById('btnStart');
let btnLeave = document.getElementById('btnLeave');
btnStart.disabled = true;
btnLeave.disabled = true;

btnStart.onclick = function () {
    game.waitForStart();
};

btnLeave.onclick = function () {
    game.leave();
};

