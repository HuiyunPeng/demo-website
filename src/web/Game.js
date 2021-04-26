import Deck from "./Deck.js";
import Player from "./Player.js";

export default class Game {
    // numPlayers is an int
    // playerNames is an array with the names of the player
    constructor(numPlayers, playerNames = false) {
        if (numPlayers < 2 || numPlayers > 4) {
            throw 'Number of players must be between 2 and 4';
        }

        this.numPlayers = numPlayers;

        this.players = new Array();
        this.createPlayers(playerNames); // sets up players
        
        this.currentPlayer = null;
        this.lastPlayer = null;

        // below could also be a hand? but may convolute purpose
        this.previousCards = null; 
        this.deck = new Deck();

        this.startGame();
        this.startPassJSON();
    }

    // getters
    getNumPlayers() {
        return this.numPlayers;
    }

    getPlayers() {
        return this.players;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getPreviousCards() {
        return this.previousCards;
    }

    // create players
    createPlayers(playerNames) {
        // will hold current player's name on most recent iteration
        var name;

        for (let i = 0; i < this.numPlayers; i++) {
            if (!playerNames) {
                name = "Player" + (i + 1);
            }
            else {
                name = playerNames[i];
            }
            this.players.push(new Player(name));
        }
        
    }

    // start game - does initialization
    startGame() {
        // initialize deck for the game
        this.deck.shuffleDeck();

        // deal cards to the players
        // cards will automatically be sorted
        this.dealCards();

        // start with player with the lowest card
        this.findPlayerLowestCard();
    }

    startPassJSON() {
        // pass to each player
        // their cards -- as card objects made to JSON with stringify
        // if they go first (true/false value)
        // the current player, this will be the same for all players
        // the next player, this will be the same for all players
        
    }

    // deal 13 cards to each player
    dealCards() {
        let min = 0;
        let max = 13;
        let numCards = 13;

        for (let player of this.players) {
            while (min < max) {
                player.addCard(this.deck.getCardByIndex(min));
                min++;
            }
            player.sortHand();
            // increment max to get the next 13 indices
            max = max + numCards;
        }
    }

    // find the player with the lowest card
    findPlayerLowestCard() {
        // get the first card of each of the players
        // the card with the lowest priority is the lowest
        
        // start by assuming the first player has the lowest card
        this.currentPlayer = this.players[0];

        for (let i = 1; i < this.numPlayers; i++) {
            if (this.players[i].getHand()[0].getPriority() < this.currentPlayer.getHand()[0].getPriority()) {
                this.currentPlayer = this.players[i];
            }
        }
    }

    // called from PlayerView, updates game
    // updates the game
    //    * update the current player to the next 
    //      player in the list
    //    * update the last player to the current player (above prev!!)
    //    * update the previously played cards to the current
    //      cards just played
    updateGame(cards = 'pass') {
        // update current player to next in list
        this.lastPlayer = this.currentPlayer;

        // update next player
        let nextPlayerIndex = (this.players.indexOf(this.lastPlayer) + 1) % this.numPlayers;
        this.currentPlayer = this.players[nextPlayerIndex];

        // update previous cards by copying array 
        // do not update cards if the player passed
        if (!(cards === 'pass')) {
            this.previousCards = [...cards];
        }


        // HUIYUN: send these values back
        // this.prevCards = new Array();
        // this.currPlayer;
        // this.nextPlayer;
    }
    
}

