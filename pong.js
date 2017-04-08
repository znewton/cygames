let gameIntervals = {};
const ball_move_amount_y = 1;
const ball_move_amount_x = 2;
const moveAmount = 2;
let ball_dir_x = 1;
let ball_dir_y = 1;
const frameRate = 50;

function endGame(players, player1, player2, playerDC, gameState, roomName) {
	clearInterval(gameIntervals[roomName]);
	console.log('Pong match: '+roomName+' ended');
	players.emit('pong:end', {
		p1_score: gameState.p1_score,
		p2_score: gameState.p2_score,
		quitter: playerDC,
		p1_id: gameState.p1_id,
		p2_id: gameState.p2_id,
	});
	player1.disconnect();
	player2.disconnect();
}

function ball_collision(gameState) {
	if(gameState.ball_x >= 100-5 && gameState.ball_x < 100-2) {
		if(gameState.ball_y > gameState.p2_paddle_y-15/2 && gameState.ball_y < gameState.p2_paddle_y+15/2) {
			ball_dir_x = -1;
		}
	} else if(gameState.ball_x > 2 && gameState.ball_x <= 5) {
		if(gameState.ball_y > gameState.p1_paddle_y-15/2 && gameState.ball_y < gameState.p1_paddle_y+15/2) {
			ball_dir_x = 1;
		}
	} else if(gameState.ball_x >= 100) {
		gameState.p1_score++;
		gameState.ball_x = 50;
		gameState.ball_y = 50;
		ball_dir_y = 1;
		ball_dir_x = -1;
	} else if(gameState.ball_x <= 0) {
		gameState.p2_score++;
		gameState.ball_x = 50;
		gameState.ball_y = 50;
		ball_dir_y = 1;
		ball_dir_x = 1;
	}
	gameState.ball_x += ball_dir_x*ball_move_amount_x;

	if(gameState.ball_y >= 100) {
		ball_dir_y = -1;
	} else if(gameState.ball_y <= 0) {
		ball_dir_y = 1;
	}
	gameState.ball_y += ball_dir_y*ball_move_amount_y;
	return gameState;
}

module.exports = {
	startGame: function (players, player1, player2, roomName) {
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
		};
		players.emit('pong:start', gameState);
		player1.on('pong:update-client', (data) => {
			gameState.p1_paddle_y += data.offset*moveAmount*frameRate/100;
		});
		player2.on('pong:update-client', (data) => {
			gameState.p2_paddle_y += data.offset*moveAmount*frameRate/100;
		});
		player2.on('disconnect', () => {
			player2.leave(player2.roomName);
			endGame(players, player1, player2, 2, gameState, roomName);
		});
		player1.on('disconnect', () => {
			player1.leave(player1.roomName);
			endGame(players, player1, player2, 1, gameState, roomName);
		});
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
		},50);
	}
};
