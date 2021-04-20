import Card from './Card.js';

export default class PlayerView {
    constructor(name) {
        this.myName = name;

        this.myCards;   // cards will be sorted by lowest to highest priority
        this.firstTurn;
        this.prevCards;
        this.currPlayer;
        this.nextPlayer;
        this.points;

        var playCardButton = document.getElementById("play_hand");
        var passButton = document.getElementById("pass");
        playCardButton.addEventListener("click", playCards);
        passButton.addEventListener("click", pass);
    }

    startGame(playerJSON) {
        this.prevCards = new Array();

        // TODO: parse JSON to fill in instance variables

        // displays the player's cards on the screen
        this.displayHand();

        if (this.currPlayer == this.myName) {
            this.firstTurn == true;   // sets special rule for first turn

            this.displayMyTurn();
        }
        else {
            this.displayNotMyTurn();
        }
    }

    displayHand() {
        // MICHELA: call every time you update your cards
    }

    displayPrevCards() {
        // MICHELA: call when receive new prev cards from the server
    }

    displayMyTurn() {
        // MICHELA: display wrappers around the screen that allow you to click
        // pass and play buttons
    }

    displayNotMyTurn() {
        // MICHELA: display wrappers around the screen that do NOT allow you to click
        // pass and play buttons
    }

    playCards() {
        // MICHELA: get the card elements with the class name selected
        var cards;

        // check if the cards are in the hand
        for (let card of cards) {
            if (this.myCards.find(card) == -1) {
                throw 'At least one card is not in the hand';
            }
        }

        // check if the cards are valid to play based
        // returns "valid" if valid, error message if not
        var validity = this.isValid(cards);

        if (validity == "valid") {
            // removes cards from hand
            // send info to server --> list of cards just played
                // HUIYUN: do we also need to send the player's name?
        }
        else {
            // MICHELA: display value of validity
        }
    }

    pass() {
        // send info to server --> fact that player did not play cards
            // HUIYUN: do we also need to send the player's name?
    }

    isValid(cards) {
        // sort the cards to make sure they're in ascending order
        cards = cards.sort();  // TODO: I'm not sure if this will work this way

        // if it's the first turn, the player can only play the lowest card in their hand
        if (this.firstTurn == true) {
            if (cards.length != 1) {
                return 'You may only play one card on the first turn';
            }
            else if (cards[0] != this.myCards[0]) {
                return 'You must play your lowest card on the first turn';
            }
            this.firstTurn = false;   // it is no longer the first turn
            return 'valid';
        }

        // check if played the same number of cards as prevPlayer
        if (cards.length != this.prevCards.length) {
            return 'you must play the same number of cards as the previous player';
        }

        // set max number of cards played in a normal hand -- normal hand can have 1-4 cards
        let maxNormalCardsPlayed = 4;
        let numPokerCardsPlayed = 5;

        // if true, this is a normal hand
        if (cards.length <= maxNormalCardsPlayed) {
            // check that these cards are playable -- each card must have the same rank
            let rank = cards[0].getRank();

            for (let i = 1; i < cards.length; i++) {
                if (cards[i].getRank() != rank) {
                    return 'all cards in a run must have the same rank';
                }
            }
            // if there were no previous cards, don't need to compare
            if (this.prevCards == null) {
                return 'valid';
            }
            // check if valid with previous cards
            return this.isNormalMoveValid(cards);
        }
        else if (cards.length == numPokerCardsPlayed){
            // check that this is a valid poker hand
            let pokerHand = this.isPokerHand();
            if (!pokerHand) {
                return 'these cards do not make a valid poker hand';
            }
            else if (this.prevCards == null) {
                // if there were no previous cards, don't need to compare
                return 'valid';
            }

            this.isPokerMoveValid()

        }
        return 'you must play between 1 and 5 cards';

        
    }

    isNormalMoveValid(cards) {
        const prioritySum = (accumulator, card) => accumulator + card.getPriority();
        let currPriority = cards.reduce(prioritySum);
        let prevPriority = this.prevCards.reduce(prioritySum);

        if (currPriority <= prevPriority) {
            return 'Cards must be higher than previously played cards';
        }

        return 'valid';
    }

    // checks if the cards being played are a valid poker hand
    isPokerHand(cards) {
        let flushSuit = cards[0].getSuit();
        let prevRank = cards[0].getRank();

        // check if STRAIGHT FLUSH / ROYAL FLUSH
        for (let i = 1; i < cards.length; i++) {
            if ((cards[i].getSuit == flushSuit) && (cards[i].getRank == (prevRank + 1))) {
                prevRank = cards[i].getRank();
            }
            else {
                break;
            }
        }
        if (i == cards.length - 1) {
            return 'sf';
        }

        // check if FOUR OF A KIND
        let sameCardCount = 1;
        let prevRank = cards[0].getRank();
        for (let i = 1; i < cards.length; i++) {
            if (sameCardCount == 4) {
                return '4k';
            }
            if (cards[i].getRank == prevRank) {
                sameCardCount++;
            }
            else {
                sameCardCount = 1;
                prevRank = cards[i].getRank();
            }
        }
        if (sameCardCount == 4) {
            return "4k";
        }

        // check if FULL HOUSE
        let firstCardCount = 1;
        let firstRank = cards[0].getRank();
        let secondCardCount = 0;
        var secondRank;

        for (let i = 1; i < cards.length; i++) {
            if (cards[i].getRank == firstRank) {
                firstCardCount++;
            }
            // ROSE: finish this
        }


        // check if STRAIGHT
        let prevRank = cards[0].getRank();

        for (let i = 1; i < cards.length; i++) {
            // to be a straight, the cards must be in ascending order by rank
            // TODO: check if a straight can have cards with the same rank but
            // different priorities?
            if (cards[i].getRank() == (prevRank + 1)) {
                prevRank = cards[i].getRank();
            }
            else {
                break; // not a straight, but could be another poker hand
            }
        }
        if (i == cards.length - 1) {
            return 's';
        }

        // check if FLUSH
        for (let i = 1; i < cards.length; i++) {
            // to be a flsuh, the cards must have the same suit
            if (!(cards[i].getSuit() == flushSuit)) {
                break; // not a flush, but could be another poker hand
            }
        }
        // check if we got to the end of the loop
        if (i == cards.length - 1) {
            return 'f';
        }

        return 'these cards do not form a poker hand, see rules for allowed poker hands';
    }
    /*
    Poker Hands
        Straight = any 5 numerically consecutive cards
        Flush = any five cards of the same suit
        Full House = 3 cards of the same number and a pair of cards that share a different number
            For the purposes of ranking you look at the 3 of a kind
            ie if 3 7s and 2 10s were played the next player could play 3 8s and 2 3s on top as a valid move of higher rank
        4 of a Kind = all 4 cards of one number and one extra card (can be anything)
        Straight Flush = 5 numerically consecutive cards all the same suit
        Royal Flush = the highest ranking flush, which is the jack, queen, king, ace, and 2 of spades
            There is only one possible royal flush

*/

    // check if the current poker hand is greater than the previous poker hand
    isPokerMoveValid() {
        // ROSE: finish this
        return 'valid'
    }

    // sorts cards
    sort() {
        this.myCards.sort(function (card, otherCard) {
            if (card.priority < otherCard.priority) {
              return -1;
            }
            if (card.priority > otherCard.priority) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });
    }
}


// what's the flow of a player taking a turn?

// 1.  player chooses cards to play
// 2.  check that the cards are in Player's hand
// 3.  check that the cards are valid. this is 100% based
//     on what was played by the previous player
//        * one card run
//              * must have played one card
//              * card must have higher priority
//        * two/three/four card run: 
//              * must have played two same cards
//              * cards must have higher summed priority
//        * special card run
//              * must have five cards
//              * must be one of the special card thingies
//              * must be either
//                  * the same special card thing with higher cards
//                  * a higher special card thing
//              * [this one will take the most manual logic]
// 4a. if cards are not valid, give user useful error 
// 4b. if cards are valid:
//        * update the current player to the next 
//          player in the list
//        * update the last player to the current player (above prev!!)
//        * update the previously played cards to the current
//          cards just played
//        * reduce the size of the player's hand by cards.length

// separate player view class
        // here is what each player needs to draw their UI
        // and the previous cards
        // and check "is this a valid move that I should submit
        // to the server"