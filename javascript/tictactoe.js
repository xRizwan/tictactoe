// factory function for player objects
const Player = function(name,symbol) {
    name = name;
    symbol = symbol;
    
    let win = function() {
        return this.symbol + " was the winner"; 
    }

    return  {
        name,
        symbol,
        win
    }
}

// module for the entire game functionality
const gameBoard = (function() {

    // cache DOM
    const board = document.querySelectorAll(".grid-item");
    const outerBoard = document.querySelector("#gameBoard");
    let body = document.querySelector("body");
    let congrats = document.getElementById("congrats");
    let winningPlace = document.querySelector(".winnerContent")
    let restart = document.querySelector(".restart")
    let playWith = document.querySelector("#computerPlayer")
    let playWithComputer = document.querySelector("#computer");
    let playWithFriend = document.querySelector("#player");

    // array for total spots
    const Gameboard = [
        ["","",""],
        ["","",""],
        ["","",""],
    ]

    // creating players
    player1 = Player("Player1", "X")
    player2 = Player("Player2", "O")

    // total players
    players = [player1,player2]
    let playerTurn = players[0];

    
    // check if player wants to play with the computer or another player
    let computer = false;
    playWithComputer.addEventListener("click", (e) =>{
        outerBoard.style.display = "grid";
        playWith.style.display = "none";
        computer = true;
    })

    playWithFriend.addEventListener("click", () => {
        outerBoard.style.display = "grid";
        playWith.style.display = "none";
        playerTurn = players[0];
        computer = false;
    })

    // change players Turn
    let count = 1;
    function changeTurn() {
        let turn;
        // if count = 0; it's player1's turn
        if (count === 0){
            count++
            return turn = players[0];
        }
        // else reset the count to 0 and now it's player2 turn
        else {
            count = 0;
            return turn = players[1]
        }
    }

    // check if someone won
    function checkWinner(row, column, symbol, n) {

        // variables to count "n" in a row, column, left-diagonal, right-diagonal
        let r = 0;
        let col = 0;
        let diag = 0;
        let rdiag = 0;

        // loop as long as i is less than n (where n is the total length of a row)
        for (let i = 0; i < n; i++){

        // for "n" in a row
            if (Gameboard[row][i] === symbol){

                // if the ith element of the gameboards row "row(name for the current row)"
                // is the players symbol then increment r(ow) count by 1
                r++;
            }

        // for "n" in a column
            if (Gameboard[i][column] === symbol){

                // if the "column'th' place of gameboards "i"th row 
                // is the players symbol then increment col(umn) count by 1
                col++
            }

        // for "n" in left diagonal
            if (Gameboard[i][i] === symbol){

                // if the i'th place of gameboards "i"th row 
                // is the players symbol then increment (left)diag count by 1
                diag++;
            }

        // for "n" is right diagonal
            if (Gameboard[i][(n - 1) - i] === symbol){

                // if the (n - 1 - i)th place of gameboards "i"th row 
                // is the players symbol then increment r(ight)diag count by 1
                rdiag++;
            }
        }

        // if any of them is equal to "n" then the player has won
        if (r === n || col === n || diag === n || rdiag === n){
            return true;
        }
    }

    // check if it was a tie
    function isTie() {
        let tie = true;
        for (let i = 0; i < Gameboard.length; i++){
            for (let j = 0; j < Gameboard[i].length; j++){
                if (Gameboard[i][j] === ""){
                    tie = false;
                    return tie;
                }
            }
        }
        return tie;
    }

    // congratulate the WInner or Declare its a tie
    function congratulateWinner(winningPlayer) {
        winningPlace.innerHTML = winningPlayer;
        congrats.style.display = "block";
    }

// optimized winner checking function for minmax algorithm
function checkWinnerOptimised(n) {
    symbols = ["X", "O"];
    for (symbol of symbols){
        for (let k = 0; k < Gameboard.length; k++){

            for (let p = 0; p < Gameboard[k].length; p++){
                // variables to count "n" in a row, column, left-diagonal, right-diagonal
                let r = 0;
                let col = 0;
                let diag = 0;
                let rdiag = 0;

                if (Gameboard[k][p] === symbol){
                    
                // loop as long as i is less than n (where n is the total length of a row)
                for (let i = 0; i < n; i++){

                    // for "n" in a row
                        if (Gameboard[k][i] === symbol){
                
                            // if the ith element of the gameboards row k
                            // is the players symbol then increment r(ow) count by 1
                            r++;
                        }
                
                    // for "n" in a column
                        if (Gameboard[i][p] === symbol){
                
                            // if the "p'th' place of gameboards "i"th row 
                            // is the players symbol then increment col(umn) count by 1
                            col++
                        }
                
                    // for "n" in left diagonal
                        if (Gameboard[i][i] === symbol){
                
                            // if the i'th place of gameboards "i"th row 
                            // is the players symbol then increment (left)diag count by 1
                            diag++;
                        }
                
                    // for "n" is right diagonal
                        if (Gameboard[i][(n - 1) - i] === symbol){
                
                            // if the (n - 1 - i)th place of gameboards "i"th row 
                            // is the players symbol then increment r(ight)diag count by 1
                            rdiag++;
                        }
                    }
                }
                        // if any of them is equal to "n" then the player has won
                if (r === n || col === n || diag === n || rdiag === n){
                    return symbol;
                }
            }
        }
    }
    if (isTie()){
        return "tie";
    }

    return null;
}


// value for each
let scores = {
    X : -1,
    tie: 0,
    O: 1,
}

// computing best possible move for the computer
function bestMove(ai) {
    let bestScore = -Infinity;
    let move;
    ai = ai;
    for (let i = 0; i < Gameboard.length; i++){
        for (let j = 0; j < Gameboard[i].length; j++){

            // checking if any space is available;
            if (Gameboard[i][j] === ''){
                Gameboard[i][j] = ai;

                // using minmax to determine the best outcome for that particular move
                let score = minimax(Gameboard, 0, false);

                // delete the move
                Gameboard[i][j] = "";

                // updating score if it's a better result and keeping the best move
                if (score > bestScore){
                    bestScore = score;
                    move = { 
                        i: i,
                        j: j 
                    }
                }
            }
        }
    }
    // making the move
    Gameboard[move.i][move.j] = ai;
}

// minmax algorithm to determine the best move
function minimax(board, depth, isMaximizing){

    // base condition for recusive function
    let result = checkWinnerOptimised(3);
    if (result !== null){
        return scores[result];
    }

    // if the symbol is maximizing then
    if (isMaximizing){
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++){
            for (let j = 0; j < board[i].length; j++) {
                // check if spot available
                if (board[i][j] ==- ''){

                    // make the move
                    board[i][j] = "O";

                    // check the best outcome of that move
                    score = minimax(board, depth + 1, false)

                    // deleting the move
                    board[i][j] = '';

                    // saving the best score
                    bestScore = Math.max(score, bestScore)
                }
            }
        }
        return bestScore;
    }

    // if symbol is minimizing then
    else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++){
            for (let j = 0; j < board[i].length; j++) {

                // check if the spot is available
                if (board[i][j] ==- ''){

                    // make the move
                    board[i][j] = "X";

                    // check the best outcome of that move
                    score = minimax(board, depth + 1, true)

                    // deleting the move
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore)
                }
            }
        }
        return bestScore;
    }
}


    // render the GameBoard array
    function render() {
        // convert the board to an Array for simplicity
        boardArr = Array.from(board);

        // loop over the Gameboards each Array
        for (let i = 0; i < Gameboard.length; i++){
            
            // loop over each element in the "ith" array
            for (let j = 0; j < Gameboard[i].length; j++){

                // loop over the boardArray and find the correct element and change it
                for (let k = 0; k < boardArr.length; k++){
                    if (boardArr[k].id === `r${i}c${j}`){  // i is the row j is the column
                        boardArr[k].innerText = Gameboard[i][j];
                    }
                }
            }
        }
    }

    // clear the board and winners
    function clear(){
        winner = false;
        tie = false;
        for (let i = 0; i < Gameboard.length; i++){
            for (let j = 0; j < Gameboard[i].length; j++){
                Gameboard[i][j] = "";
            }
        }
        // outerBoard.style.display = "grid";
        playWith.style.display = "block";
        congrats.style.display = "none";
    }

    // no winner or tie by default
    let winner = false;
    let tie = false;


    // computer move
    function computerMove(Gameboard) {
        for (let i = 0; i < Gameboard.length; i++){
            for (let j = 0; j < Gameboard[i].length; j++){
                if (Gameboard[i][j] === ""){
                    return {
                        row: i,
                        col: j,
                    }
                }
            }
        }
    }

    // play turn
    function playTurn() {

        // add an onclick handler to each box in the grid(board)X
    board.forEach((element) => {
        element.addEventListener("click", (e) => {
            // if winner is true then don't let user add symbols on the block
            if (winner){
                return;
            }

            else{
                // get the rowNumber and columnNumber of the event
                let rowCol = e.path[0].id.match(/\d+/g); // get all the numbers only
                let row = rowCol[0]; // first number is the row
                let column = rowCol[1] // second number is the column
                let currentBox = e.path[0]; // current box is the first element in the array

                // if box already has a symbol dont let the player change it
                if (Gameboard[row][column] != ''){
                    console.log("Already Exists")
                }
                else {
                    symbol = playerTurn.symbol;
                    Gameboard[row][column] = symbol;
                    currentBox.textContent = symbol;
                    winner = checkWinner(row, column, symbol, Gameboard[row].length)
                    tie = isTie();

                    if(winner){
                        alert(playerTurn.win());
                        outerBoard.style.display = "none";
                        congratulateWinner(playerTurn.win());
                        return
                    }
                    else if(tie) {
                        alert("It's a Tie")
                        outerBoard.style.display = "none";
                        congratulateWinner("It was a Tie!");
                        return
                    }
                    if (computer)
                    {
                        bestMove("O");
                        render();
                        winner = checkWinnerOptimised(3);
                        if (winner === "O"){
                            setTimeout( function () {
                                alert("You Lost")
                            outerBoard.style.display = "none";
                            congratulateWinner("You Lost");
                            }, 1000)
                        }
                    }
                    else {
                        playerTurn = changeTurn();
                    }
                }
            }

            // restart the game when the restart button was clicked
            restart.addEventListener("click", () => {
                clear();
                render();
            })
        })
    })
}


    playTurn();
    render();
})();