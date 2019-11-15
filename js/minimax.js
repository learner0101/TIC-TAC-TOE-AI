var initBoard;
var humanPlayer = 'O';
var computer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
const data = document.querySelectorAll('.cell');
startGame();



function startGame() {
	document.querySelector(".end-game").style.display = "none";
	initBoard = Array.from(Array(9).keys());
	for (var i = 0; i < data.length; i++) {
		data[i].innerText = '';
		data[i].style.removeProperty('background-color');
		data[i].addEventListener('click', turnClick, false);
	}
}



function turnClick(square) {
	if (typeof initBoard[square.target.id] == 'number') {
		turn(square.target.id, humanPlayer)
		if (!checkWin(initBoard, humanPlayer) && !checkTie()) turn(bestSpot(), computer);
	}
}



function turn(squareId, player) {
	initBoard[squareId] = player;
  document.getElementById(squareId).style.background= "	#800000";
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(initBoard, player)
	if (gameWon) gameOver(gameWon)
}



function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}



function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == humanPlayer ? "blue" : "red";
	}
	for (var i = 0; i < data.length; i++) {
		data[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose!");
}



function declareWinner(who) {
	document.querySelector(".end-game").style.display = "block";
	document.querySelector(".end-game").innerText = who;
}



function emptySquares() {
	return initBoard.filter(s => typeof s == 'number');
}



function bestSpot() {
	return minimax(initBoard, computer).index;
}



function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < data.length; i++) {
			data[i].style.backgroundColor = "navy";
			data[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}



function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);
	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;
		if (player == computer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}
	var bestMove;
	if(player === computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}