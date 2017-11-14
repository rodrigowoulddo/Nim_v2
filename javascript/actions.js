
/****** CLASSES *****************************/


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
}

class Game{

    constructor(){
        const self = this;
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


/****** TESTS *****************************/
var game = new Game();
game.numberOfPiles = 5;
game.createBoard();
