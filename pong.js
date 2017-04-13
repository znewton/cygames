let gameIntervals = {};
const ball_move_amount_y = 1;
const ball_move_amount_x = 1;
const moveAmount = 2;
const ball_width = 4;
const paddle_height = 16;
const frameRate = 35;

function endGame(players, player1, player2, playerDC, gameState, roomName) {
	// Clear the game interval after the game exits. VERY IMPORTANT
	clearInterval(gameIntervals[roomName]);
	// Log the game ending
	console.log('Pong match: '+roomName+' ended');
	// Tell the players who won
	players.emit('pong:end', {
		p1_score: gameState.p1_score,
		p2_score: gameState.p2_score,
		quitter: playerDC,
		p1_id: gameState.p1_id,
		p2_id: gameState.p2_id,
	});
	setTimeout(function() {
		player1.leave(roomName);
		player2.leave(roomName);
	}, 1000);
}
function calculateBallYDir(gameState) {
	// Increase or decrease the Ball's y velocity depending on where it hits the paddle
	if(gameState.ball_y < (gameState.p2_paddle_y - paddle_height/2 + paddle_height/3)) {
		if(gameState.ball_dir_y > -2) gameState.ball_dir_y--;
	} else if (gameState.ball_y > (gameState.p2_paddle_y + paddle_height/2 - paddle_height/3)) {
		if(gameState.ball_dir_y < 2) gameState.ball_dir_y++;
	}
	return gameState;
}
function ball_collision(gameState) {
	// Change the ba
	let ball_right = gameState.ball_x + ball_width/2;
	let ball_left = gameState.ball_x - ball_width/2;
	let ball_top = gameState.ball_y - ball_width/2;
	let ball_bottom = gameState.ball_y + ball_width/2;
	if(ball_right >= 100-5 && ball_right < 100-2) { // Bounce off right paddle
		if(ball_bottom > gameState.p2_paddle_y-paddle_height/2
			 && ball_top < gameState.p2_paddle_y+paddle_height/2) {
			gameState.ball_dir_x = -1;
			gameState = calculateBallYDir(gameState);
		}
	} else if(ball_left > 2 && ball_left <= 5) { // Bounce off left paddle
		if(ball_bottom > gameState.p1_paddle_y-paddle_height/2 && ball_top < gameState.p1_paddle_y+paddle_height/2) {
			gameState.ball_dir_x = 1;
			gameState = calculateBallYDir(gameState);
		}
	} else if(ball_left >= 100) { // p1 scores and reset ball
		gameState.p1_score++;
		gameState.ball_x = 50;
		gameState.ball_y = 50;
		gameState.ball_dir_y = 0;
		gameState.ball_dir_x = -1;
	} else if(ball_right <= 0) { // p2 scores and reset ball
		gameState.p2_score++;
		gameState.ball_x = 50;
		gameState.ball_y = 50;
		gameState.ball_dir_y = 0;
		gameState.ball_dir_x = 1;
	}
	// Change the ball's x position
	gameState.ball_x += gameState.ball_dir_x*ball_move_amount_x;

	// Reverse the Y direction of the ball when hitting the top and bottom of screen
	if(ball_bottom >= 100 || ball_top <= 0) {
		gameState.ball_dir_y *= -1;
	}
	// Change the ball's y position
	gameState.ball_y += gameState.ball_dir_y*ball_move_amount_y;
	return gameState;
}

module.exports = {
	startGame: function (players, player1, player2, roomName) {
		// Set base game state
		let gameState = {
			p1_id: player1.uid,
			p2_id: player2.uid,
			p1_score: 0,
			p2_score: 0,
			p1_paddle_y: 40,
			p2_paddle_y: 40,
			ball_x: 50,
			ball_y: 50,
			res: 100,
			ball_dir_x: 1, // Ball goes to the right first
			ball_dir_y: 0,
		};
		// Tell players they connected to a match
		players.emit('pong:start', gameState);
		// Recieve player movement updates
		player1.on('pong:update-client', (data) => {
			gameState.p1_paddle_y += data.offset*moveAmount*frameRate/100;
		});
		player2.on('pong:update-client', (data) => {
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
				players.emit('pong:update-server', gameState);
				if(gameState.p1_score == 10 || gameState.p2_score == 10) {
					endGame(players, player1, player2, null, gameState, roomName);
				}
			},frameRate);
		},4100);
	}
};
