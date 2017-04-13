let gameIntervals = {};
const initial_length = 5;
const frameRate = 35;
const cw = 1;

function endGame(players, player1, player2, playerDC, gameState, roomName) {
	// Clear the game interval after the game exits. VERY IMPORTANT
	clearInterval(gameIntervals[roomName]);
	// Log the game ending
	console.log('Snake match: '+roomName+' ended');
	// Tell the players who won
	players.emit('snake:end', {
		p1_score: gameState.p1_score,
		p2_score: gameState.p2_score,
		quitter: playerDC,
		p1_id: gameState.p1_id,
		p2_id: gameState.p2_id,
	});
	// player1.disconnect();
	// player2.disconnect();
}
function check_dir(newDir, oldDir) {
	let dir = oldDir;
	if(newDir == "left" && oldDir != "right") dir = "left";
	else if(newDir == "up" && oldDir != "down") dir = "up";
	else if(newDir == "right" && oldDir != "left") dir = "right";
	else if(newDir == "down" && oldDir != "up") dir = "down";
	return dir;
}

module.exports = {
	startGame: function (players, player1, player2, roomName) {
		// Set base game state
		let gameState = {
      p1_snake_array: [],
      p2_snake_array: [],
      p1_score: 0,
      p2_score: 0,
      p1_dir: 'right',
      p2_dir: 'left',
		};
		for(var i = initial_length-1; i>=0; i--)
		{
			gameState.p1_snake_array.push({x: i, y:0});
			gameState.p2_snake_array.push({x: w/cw - i, y:h/cw-1});
		}
		// Tell players they connected to a match
		players.emit('snake:start', gameState);
		// Recieve player movement updates
		player1.on('snake:update-client', (data) => {
			gameState.p1_paddle_y += data.offset*moveAmount*frameRate/100;
		});
		player2.on('snake:update-client', (data) => {
			gameState.p2_paddle_y += data.offset*moveAmount*frameRate/100;
		});
		// Handle players leaving early
		player2.on('disconnect', () => {
			player2.leave(player2.roomName);
			if(gameIntervals[player2.roomName])
				endGame(players, player1, player2, 2, gameState, roomName);
		});
		player1.on('disconnect', () => {
			player1.leave(player1.roomName);
			if(gameIntervals[player1.roomName])
				endGame(players, player1, player2, 1, gameState, roomName);
		});
		// Start the game loop after 4.1 seconds
		setTimeout(function() {
			gameIntervals[roomName] = setInterval(() => {
				if(gameState.ball_y >= 100) {
					ball_dir_y = -1;
				} else if(gameState.ball_y <= 0) {
					ball_dir_y = 1;
				}
				gameState = ball_collision(gameState);
				players.emit('snake:update-server', gameState);
				if(gameState.p1_score == 10 || gameState.p2_score == 10) {
					endGame(players, player1, player2, null, gameState, roomName);
				}
			},frameRate);
		},4100);
	}
};
