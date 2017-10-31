
/****** CLASSES *****************************/

class Game{

    constructor(){
        this.numberOfPiles = 0;
        this.dificulty = 0;
        this.Player1Counter = 0;
        this.Player2Counter = 0;
        this.firstPlayer = 1;
        this.piles = [];

        this.element = document.getElementById('board');
    }

    gameOver(){
        for(let i = 0; i < this.piles.length; i++)
            if(!this.piles[i].emptyPile())
                return false;

        return true
    }

    createBoard(){
        for(let i = 0; i < this.numberOfPiles; i++){

            /*create pile dinamicaly and inserts on board*/
            const pile = new Pile('pile'+i);

            for(let i2 = 0; i2 < 8; i2++){  /*each pile has 8 slots for playables*/
                const playable = new Playable('playablei'+i+'_'+i2);
                pile.playables.push(playable);
                pile.element.appendChild(playable.element); /*appends the HTML playable to the pile*/
            }

            this.piles.push(pile);
            this.element.appendChild(pile.element); /*appends the HTML pile to the board*/
        }
    }
}

class Pile{
    constructor(id){
        this.playables = [];
        this.element = document.createElement('div');
        this.element.id = id;
        this.element.className = 'pile';
    }

    static emptyPile(){
        for(let i = 0; i < this.playables.length; i++)
            if(this.playables[i].state)
                return false;

        return true;
    }
}

class Playable {
    constructor(id) {
        this.state = true;

        /*creates the HTML element*/
        this.element = document.createElement('div');
        this.element.id = id;
        this.element.className = 'playable';
    }
}


/****** TESTS *****************************/
var game = new Game();
game.numberOfPiles = 3;
game.createBoard();

alert(game.piles[2].playables[3].state);
