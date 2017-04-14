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
	console.log('Tanks match: '+roomName+' ended');
	// Tell the players who won
	players.emit('tanks:end', {
		p1_lives: gameState.p1_lives,
		p2_lives: gameState.p2_lives,
		quitter: playerDC,
		p1_id: gameState.p1_id,
		p2_id: gameState.p2_id,
	});
	setTimeout(function() {
		player1.leave(roomName);
		player2.leave(roomName);
	}, 1000);
}

function component(width, height, color, x, y, type) {
	this.type = type;
	this.score = 0;
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.numberOfShots = 3;
	this.update = function() {
		ctx = myGameArea.context;
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
		this.hitBottom();
	}
	this.hitBottom = function() {
		var rockbottom = myGameArea.canvas.height - this.height;
		if (this.y > rockbottom) {
			this.y = rockbottom;
		}
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
			crash = false;
		}
		return crash;
	}
}

function bullet(width, height, color, x, y, shooter){
	this.shooter = shooter;
	this.width = width;
	this.height = height;
	this.speedX = 1;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	this.newPos = function() {
		if (this.shooter == "player1") {
			this.x += this.speedX;
			this.y += this.speedY;
		} else {
			this.x -= this.speedX;
			this.y += this.speedY;
		}
		this.hitBottom();
	}
	this.hitBottom = function() {
		var rockbottom = myGameArea.canvas.height - this.height;
		if (this.y > rockbottom) {
			this.y = rockbottom;
		}
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
			crash = false;
		}
		return crash;
	}
}

module.exports = {
	startGame: function (players, player1, player2, roomName) {
		// Set base game state
		let gameState = {
			p1_id: player1.uid,
			p2_id: player2.uid,
			p1_lives: 1,
			p2_lives: 1,
      		p1: new component(30, 30, "red", 10, 120),
      		p2: new component(30, 30, "blue", 300, 120),
      		bullets: [],
			over: false,
			res: 100
		};
		// Tell players they connected to a match
		players.emit('tanks:start', gameState);
		// Recieve player movement updates
		player1.on('tanks:update-client', (data) => {
      if(data.fire){
        gameState.bullets.push(new bullet(5,5,"black",player1.x,player1.y,"player1"));
      }
			gameState.p1.y += data.offsetY*moveAmount*frameRate/100;
      gameState.p1.x += data.offsetX*moveAmount*frameRate/100;
		});
		player2.on('tanks:update-client', (data) => {
      if(data.fire){
        gameState.bullets.push(new bullet(5,5,"black",player2.x,player2.y,"player2"));
      }
			gameState.p2.y+= data.offsetY*moveAmount*frameRate/100;
      gameState.p2.x+= data.offsetX*moveAmount*frameRate/100;
		});
		// Handle players leaving early
		player2.on('disconnect', () => {
			if(gameState.over) return;
			player2.leave(player2.roomName);
			if(gameIntervals[player2.roomName])
				endGame(players, player1, player2, 2, gameState, roomName);
		});
		player1.on('disconnect', () => {
			if(gameState.over) return;
			player1.leave(player1.roomName);
			if(gameIntervals[player1.roomName])
				endGame(players, player1, player2, 1, gameState, roomName);
		});
		// Start the game loop after 4.1 seconds
		setTimeout(function() {
			gameIntervals[roomName] = setInterval(() => {
        for(i = 0; i < gameState.bullets.length;i++){
          gameState.bullets[i].newPos;
        }
				players.emit('tanks:update-server', gameState);
				if(gameState.p1_lives < 1 || gameState.p2_lives < 10) {
					gameState.over = true;
					endGame(players, player1, player2, null, gameState, roomName);
				}
			},frameRate);
		},4100);
	}
};
