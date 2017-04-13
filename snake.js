let gameIntervals = {};
const initial_length = 5;
const frameRate = 50;
const cw = 2;
const w = 100;
const h = 50;

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
	setTimeout(function() {
		player1.disconnect();
		player2.disconnect();
	}, 1000);
}
function check_collision(x, y, array)
{
	for(let i = 0; i < array.length; i++)
	{
		if(array[i].x == x && array[i].y == y)
		 return true;
	}
	return false;
}
function check_dir(newDir, oldDir) {
	let dir = oldDir;
	if(newDir == "left" && oldDir != "right") dir = "left";
	else if(newDir == "up" && oldDir != "down") dir = "up";
	else if(newDir == "right" && oldDir != "left") dir = "right";
	else if(newDir == "down" && oldDir != "up") dir = "down";
	return dir;
}
function create_food()
{
	return {
		x: Math.round(Math.random()*(w-cw)/cw),
		y: Math.round(Math.random()*(h-cw)/cw),
	};
}
function move_snake(gameState, player) {
		let snake = gameState[player+'_snake_array'];
		let dir = gameState[player+'_dir']
		let score = gameState[player+'_score'];
		// next x and next y
		let nx = snake[0].x;
		let ny = snake[0].y;
		if(dir == "right") nx++;
		else if(dir == "left") nx--;
		else if(dir == "up") ny--;
		else if(dir == "down") ny++;

		if(nx == -1) nx = w/cw-1;
		else if (nx == w/cw) nx = 0;

		if(ny == -1) ny = h/cw-1;
		else if (ny == h/cw) ny = 0;

		let opponentSnake = gameState[(player == 'p1' ? 'p2' : 'p1')+'_snake_array'];
		let opponentScore = gameState[(player == 'p1' ? 'p2' : 'p1')+'_score'];
		if(check_collision(nx, ny, snake) || check_collision(nx, ny, opponentSnake))
		{
			score = Math.floor(score/(opponentScore || opponentScore+1));
			gameState[player+'_score'] = score;
			gameState.over = true;
			return gameState;
		}

		if(nx == gameState.food.x && ny == gameState.food.y) {
			let tail = {x: nx, y: ny};
			score++;
			gameState.food = create_food();
			snake.unshift(tail);
		}

		let tail = snake.pop();
		tail.x = nx; tail.y = ny;
		snake.unshift(tail);

		gameState[player+'_snake_array'] = snake;
		gameState[player+'_score'] = score;
		return gameState;
}

module.exports = {
	startGame: function (players, player1, player2, roomName) {
		// Set base game state
		let gameState = {
			p1_id: player1.uid,
			p2_id: player2.uid,
      p1_snake_array: [],
      p2_snake_array: [],
      p1_score: 0,
      p2_score: 0,
      p1_dir: 'right',
      p2_dir: 'left',
			food: create_food(),
			over: false,
			res: 100,
		};
		for(let i = initial_length-1; i>=0; i--)
		{
			gameState.p1_snake_array.push({x: i, y:0});
			gameState.p2_snake_array.push({x: w/cw - i, y:h/cw-1});
		}
		// Tell players they connected to a match
		players.emit('snake:start', gameState);
		// Recieve player movement updates
		player1.on('snake:update-client', (data) => {
			gameState.p1_dir = check_dir(data.dir, gameState.p1_dir);
		});
		player2.on('snake:update-client', (data) => {
			gameState.p2_dir = check_dir(data.dir, gameState.p2_dir);
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
		    gameState = move_snake(gameState, 'p1');
		    if(!gameState.over) {
			    gameState = move_snake(gameState, 'p2');
			    if(!gameState.over) {
						players.emit('snake:update-server', gameState);
						return;
					}
				}
		    if(gameState.over)
					endGame(players, player1, player2, null, gameState, roomName);
			},frameRate);
		},4100);
	}
};
