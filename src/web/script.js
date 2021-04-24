import Card from "./Card.js";
import Deck from "./Deck.js";
import Game from "./Game.js";
import Hand from "./templates/Hand.js";
import Player from "./templates/Player.js";

let aceOfHearts = new Card(14, 3); 
let sevenOfSpades = new Card(7, 4);
let twoOfClubs = new Card(2, 2);
let aceOfHearts2 = new Card(14, 3); 
let tenOfDiamonds = new Card(10, 1);
let threeOfClubs = new Card(3, 4);

let cardsForHand = [aceOfHearts, sevenOfSpades, twoOfClubs, aceOfHearts, aceOfHearts, tenOfDiamonds, aceOfHearts, aceOfHearts, aceOfHearts, aceOfHearts, aceOfHearts, aceOfHearts, aceOfHearts];



handTests();
playerTests();
cardTests();
deckTests();
gameTests();

function cardTests() {
    console.log("*********TESTS FOR CARD CLASS*********");
    // test to strings
    console.log("This card is:", aceOfHearts.getCardString());
    console.log("This card is:", sevenOfSpades.getCardString());
    console.log("This card is:", twoOfClubs.getCardString());

    // test priority
    console.log("Priority should be: 47. Priority is:", aceOfHearts.getPriority());
    console.log("Priority should be: 20. Priority is:", sevenOfSpades.getPriority());
    console.log("Priority should be: 50. Priority is:", twoOfClubs.getPriority());

    // test comparison
    console.log("\n***Comparing Cards***");
    console.log("First card is less. Should be negative", aceOfHearts.compare(twoOfClubs));
    console.log("First card is greater. Should be positive", aceOfHearts.compare(sevenOfSpades));
    console.log("Cards are same. Should be equal", aceOfHearts.compare(aceOfHearts2));
    console.log("")

    // test file path
    console.log("\n***Filepath***");
    console.log(threeOfClubs.getFilePath());
}

function handTests() {
    console.log("\n\n*********TESTS FOR HAND CLASS*********");
    let firstHand = new Hand();
    console.log("Initial hand size", firstHand.getSize());
    
    firstHand.createHand(cardsForHand);
    
    // test getters
    console.log("\n***Test getters***");
    console.log(firstHand.getCards());
    console.log(firstHand.getCardsString());
    console.log("Hand size after initialization", firstHand.getSize());
    
    // test hand sorting
    firstHand.sort()
    console.log(firstHand.getCards());
    
    // test removing a card
    firstHand.removeCard(twoOfClubs);
    console.log(firstHand.getCards());
    console.log("Hand size after removing one card", firstHand.getSize());    
}

function playerTests() {
    console.log("\n\n*********TESTS FOR PLAYER CLASS*********");
    // named player
    let namedPlayer = new Player("Brisk")
    // unnamed player
    let unnamedPlayer = new Player();
    
    // test getters
    console.log("\n***Test getters***");
    console.log("Named player is named", namedPlayer.getName(), "and starts with", namedPlayer.getPoints(), "and an empty hand:", namedPlayer.getHand());
    console.log("Named player is named", unnamedPlayer.getName(), "and starts with", unnamedPlayer.getPoints(), "and an empty hand:", unnamedPlayer.getHandString());
    
    // test making hand -- temporary until this functionality
    // is moved into the game
    console.log("\n***Test making hands***");
    namedPlayer.makeHand(cardsForHand);
    console.log(namedPlayer.getName(), "hand:", namedPlayer.getHand());
    
    console.log("\n***Test playing cards***");
    let cardsToRemove = new Array(threeOfClubs);
    
    console.log("Attempt to play card not in hand");
    try {
        namedPlayer.playCards([cardsToRemove]);
    }
    catch(e) {
        console.log("exception thrown!");
    }
    
    // no longer working, because cards must have a rules object
    // before removing any cards
    /*
    cardsToRemove = new Array(twoOfClubs);
    console.log(cardsToRemove);
    console.log("Attempt to play one card that is in hand");
    namedPlayer.playCards(cardsToRemove);
    console.log("After removing two of clubs", namedPlayer.getHand());
    
    console.log("Attempt to play multiple cards in hand");
    cardsToRemove = new Array(aceOfHearts, sevenOfSpades);
    namedPlayer.playCards(cardsToRemove);
    console.log("After removing ace of hearts, seven of spades", namedPlayer.getHand());    
    */
}


function deckTests() {
    console.log("\n\n*********TESTS FOR DECK CLASS*********");
    let testDeck = new Deck();
    console.log(testDeck.getCards());
    
    testDeck.shuffleDeck();
    console.log(testDeck.getCards());

    let testMohoDeck = new Deck("moho");
    console.log(testMohoDeck.getCards());
}

function gameTests() {
    console.log("\n\n*********TESTS FOR GAME CLASS*********");
    // attempt to create a game with one player
    try {
        let onePlayerGame = new Game(1);
    }
    catch(e) {
        console.log(e, "-- exception thrown!");
    }
    
    // create a new game with two players
    let twoPlayerGame = new Game(2);
    
    // create a new game with four players
    let threePlayerGame = new Game(3);
    
    // create a new game with one player
    let fourPlayerGame = new Game(4);
    
    console.log("\n***Test getters (and createPlayers)***");
    console.log("Two player game with", twoPlayerGame.getNumPlayers(), "players named", twoPlayerGame.getPlayers());
    console.log("Three player game with", threePlayerGame.getNumPlayers(), "players named", threePlayerGame.getPlayers());
    console.log("Four player game with", fourPlayerGame.getNumPlayers(), "players named", fourPlayerGame.getPlayers());
    
    console.log("\n***Test start game: two player***");
    twoPlayerGame.startGame();
    // hands should be automatically sorted by the game
    console.log("Player 1's hand:", twoPlayerGame.getPlayers()[0].getHand());
    console.log("Player 2's hand:", twoPlayerGame.getPlayers()[1].getHand());
    
    console.log("\n***Test start game: four player***");
    fourPlayerGame.startGame();
    // hands should be automatically sorted by the game
    console.log("Player 1's hand:", fourPlayerGame.getPlayers()[0].getHand());
    console.log("Player 2's hand:", fourPlayerGame.getPlayers()[1].getHand());
    console.log("Player 3's hand:", fourPlayerGame.getPlayers()[2].getHand());
    console.log("Player 4's hand:", fourPlayerGame.getPlayers()[3].getHand());
    
    console.log("\n***Test starting player***");
    console.log("The player with the lowest card in four player game is", fourPlayerGame.getCurrentPlayer(), "and the card is", fourPlayerGame.getCurrentPlayer().getHand()[0]);
    console.log("The player with the lowest card in two player game is", twoPlayerGame.getCurrentPlayer(), "and the card is", twoPlayerGame.getCurrentPlayer().getHand()[0]);

    // create a new game with named players
    console.log("\n***Test create game: NAMED player***");
    let playerNames = ['Michela', 'Huiyun', 'Rose'];
    let namedThreePlayerGame = new Game(playerNames.length, playerNames);

    console.log("Three player game with", namedThreePlayerGame.getNumPlayers(), "players named", namedThreePlayerGame.getPlayers());

    namedThreePlayerGame.startGame();
    console.log("Michela's's hand:", namedThreePlayerGame.getPlayers()[0].getHand());
    console.log("Huiyun's hand:", namedThreePlayerGame.getPlayers()[1].getHand());
    console.log("Rose's hand:", namedThreePlayerGame.getPlayers()[2].getHand());

    let Michela = namedThreePlayerGame.getPlayers()[0];

   //Michela.playCards(Michela.getHand().slice(0, 1));
}



