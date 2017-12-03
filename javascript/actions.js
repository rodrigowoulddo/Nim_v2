
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
            if(xhr.readyState === COMPLETE_REQUEST && xhr.status === STATUS_COMPLETE && executedFunction !== null) {
                let response = JSON.parse(xhr.responseText);
                console.log(response);
                executedFunction(response);
            }else{
                if(xhr.status !== STATUS_COMPLETE && executedFunctionError !== null )
                    executedFunctionError(xhr.responseText);

                if(xhr.responseText !== null && xhr.responseText!== "" && xhr.responseText !== "{}" && executedListener !== null)
                    executedListener(Util.getLastLine(xhr.responseText));
            }
        };
        console.log(xhr);

        xhr.send(data);
    }
}

class Messeger{
    constructor(){
        this.element = document.getElementById('txtMessage');
    }

    showGreenMessege(messege){
        this.element.style.display = "block";
        this.element.style.backgroundColor = "green";
        this.element.innerHTML = messege;
    }

    showRedMessege(messege){
        this.element.style.display = "block";
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
        this.user = null;

        this.element = document.getElementById('board');
    }

    deleteBoard(){
        while (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.lastChild);
        }
        this.piles=[];
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

    resetBoard(){

        for(let i = 0; i < this.piles.length; i++){
            this.piles[i].reset();
        }
        this.blockBoard();
    }

    createBoard(){
        this.deleteBoard();
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

        this.blockBoard();
    }

    waitForStart(){
        Server.executeRequest("GET", "update?nick="+game.user.nick+"&"+"game="+this.id, null, Game.startGame, Game.showStartError, Game.updateGame);

        btnStart.disabled = true;
        btnLeave.disabled = false;
        this.messeger.showRedMessege("Waiting for the other player...");
    }

    static startGame(responseJSON){
        btnStart.disabled = true;
        btnLeave.disabled = false;
    }

    static showStartError(messegeJSON){
        btnStart.disabled = true;
        btnLeave.disabled = true;

        game.messeger.showRedMessege("Start error - "+JSON.parse(messegeJSON).error);

        btnLogin.disabled = false;
    }

    blockBoard(){
        for(let i = 0; i < this.piles.length; i++){
            this.piles[i].block();
        }
    }

    unblockBoard(){
        for(let i = 0; i < this.piles.length; i++){
            this.piles[i].unblock();
        }
    }

    static updateGame(responseJSON){

        let updateMessege = Util.getLastLine(responseJSON).substring(5);

        if(Util.getAtributes(updateMessege).includes('turn')){

            let state = JSON.parse(updateMessege);
            console.log(state.turn+"'s turn - "+"Board is now: "+state.rack);

            if(state.turn === game.user.nick){
                game.messeger.showGreenMessege("Your turn!");
                game.unblockBoard();
            }
            else{
                game.messeger.showRedMessege(state.turn+"'s turn! Wait...");
                game.blockBoard();
            }

            game.updatePiles(state.rack);
        }

        if(Util.getAtributes(updateMessege).includes('winner')) {
            let state = JSON.parse(updateMessege);
            let winner = state.winner;
            game.blockBoard();
            // game.updatePiles(state.rack);
            Game.win(winner);
        }
    }

    updatePiles(rack){
        console.log("new board is now: "+rack);
        for(let i = 0; i < rack.length; i++){
            this.piles[i].setNumberOfPlayables(rack[i]);
        }
    }

    static win(nick){
        console.log("winner is "+nick);

        if(game.user.nick === nick)
            game.messeger.showGreenMessege("You won the game!!");
        else{
            if(nick !== null)
                game.messeger.showRedMessege(nick+" won the game!!");
            else
                game.messeger.showRedMessege("Nobody won the game!!");

        }


        game.resetViews();
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

    static leave(){

        /*{"nick": "zp", "pass": "evite", "game": "fa93b4..." }*/
        let leave = new Leave();
        leave.nick = game.user.nick;
        leave.pass = game.user.pass;
        leave.game = game.id;

        Server.executeRequest("POST", "leave", JSON.stringify(leave), Game.leaveSucess, Game.leaveError, null);
    }

    static leaveSucess(responseJSON){
        game.resetViews();
    }

    static leaveError(messegeJSON){
        game.messeger.showRedMessege("Leave error"+JSON.parse(messegeJSON).error)
    }


    static play(pile, remainPlayables){

        /*{"nick": "zp", "pass": "evite", "game": "2fd9d...", "stack": 3, "pieces": 1 }*/

        let notification = new Notification();

        notification.game = game.id;
        notification.nick = game.user.nick;
        notification.pass = game.user.pass;
        notification.stack = pile;
        notification.pieces = remainPlayables;

        Server.executeRequest('POST','notify',JSON.stringify(notification),null,null,null);

    }

    resetViews(){

        Window.closeAllWindows();
        loginWindow.btnOpen.disabled = false;
        configWindow.btnOpen.disabled = false;
        btnStart.disabled = true;
        btnLeave.disabled = true;
        this.resetBoard();

    }

    changeNumberOfPiles(nPiles){
        this.numberOfPiles = nPiles;
        this.createBoard();
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

    setNumberOfPlayables(numberOfPlayables){
        let j = 8;
        for(let i = 0; i < this.playables.length; i++){
            if(j > numberOfPlayables)
                this.playables[i].removePlayable();
            j--
        }
    }

    block(){
        for(let i = 0; i < this.playables.length; i++){
            this.playables[i].makeUnclicable();
        }
    }

    unblock(){
        for(let i = 0; i < this.playables.length; i++){
            this.playables[i].makeClicable();
        }
    }

    reset() {
        for (let i = 0; i < this.playables.length; i++) {
            this.playables[i].addPlayable();
        }
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

    addPlayable(){
        this.state = true;
        this.unBlockElement();
    }

    unBlockElement(){
        this.element.style.background = "darkslategrey";
        this.element.style.pointerEvents = "auto";
        this.element.style.border = "outset";
        this.element.style.margin = "0px"; /*so the border doesnt make diference*/
    }

    makeUnclicable(){
        if(this.state === true)
            this.element.style.pointerEvents = "none";
    }

    makeClicable(){
        if(this.state === true)
            this.element.style.pointerEvents = "auto";
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
        // this.removePlayable();
        // this.romoveAllAbove();
        // game.checkForWinner();
        // this.pileFather.gameFather.checkForWinner();

        let playableId = this.element.id;
        let playablereference = playableId.substring(9);

        let pile = playablereference[0];
        let playable = playablereference[2];

        Game.play(pile,(7-playable));
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
            this.btnRegister = document.getElementById("btnRegister");
            this.txtNick = document.getElementById("txtNick");
            this.txtPass = document.getElementById("txtPass");

            this.btnDoLogin.onclick = function () {
                self.login();
            };

            this.btnRegister.onclick = function () {
                self.register();
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

    register(){

        let nick = this.txtNick.value;
        let pass = this.txtPass.value;
        let user = new User(nick,pass);

        Server.executeRequest("POST","register", JSON.stringify(user), Window.makeRegister, Window.showRegisterError, null);

    }

    static makeRegister(responseJSON){
        game.messeger.showGreenMessege('Register sucefull!');
    }

    static showRegisterError(messegeJSON){
        game.messeger.showRedMessege("Register error - "+JSON.parse(messegeJSON).error);
    }


    static makeLogin(gameIdJSON){
        game.messeger.clearMessege();
        game.id = gameIdJSON.game;

        /*block login and config opening*/
        loginWindow.btnOpen.disabled = true;
        configWindow.btnOpen.disabled = true;

        /*unblock start and reset*/
        btnStart.disabled = false;
        btnLeave.disabled = true;

        /*closes the login window*/
        Window.closeAllWindows();

    }

    static showLoginError(messegeJSON){
        game.messeger.showRedMessege("Login Failed - "+JSON.parse(messegeJSON).error);
    }

    static updateRaanking(){
        Window.clearTableRankingRows();

        let ranking = new Ranking;
        ranking.size = game.numberOfPiles;

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

    static showRankingError(messegeJSON){
        game.messeger.showRedMessege("Ranking load Failed - "+JSON.parse(messegeJSON).error);
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

class Notification{

}



/****** UTIL *****************************/
class Util{
    static getLastLine(text){
            if(text.lastIndexOf("\n")>0) {
                let lines = text.split("\n");

                lines = lines.filter(function(a){return a !== ""});

                /*debug*/
                console.log(lines);

                return lines[lines.length - 1];
            }else{
                return text;
            }
    }



    static getAtributes(json){

        let obj = JSON.parse(json);
        let keys = [];
        for(let key in obj){
                keys.push(key);
            }
        return keys;
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
    Game.leave();
};

let radio3piles = document.getElementById('radio3piles');
let radio5piles = document.getElementById('radio5piles');

radio3piles.onclick = function () {
    game.changeNumberOfPiles(3);
};

radio5piles.onclick = function () {
    game.changeNumberOfPiles(5);
};