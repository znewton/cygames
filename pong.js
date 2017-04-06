module.exports = {
	startGame: function (players) {
		let gameState = {
			p1_paddle_y: 10,
			p2_paddle_y: 20,
			ball_x: 50,
			ball_y: 50,
			res: 100,
		};
		players.emit('game update', gameState);
	}
};