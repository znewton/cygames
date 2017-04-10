document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	var w = canvas.width;
	var h = canvas.height;

	var cw = Math.ceil(w/50);
	var d1;
  var d2;
	var food;
  var gameState = {};

	function init()
	{
		d1 = "right";
		d2 = "left";
		create_snakes();
		create_food();
		score1 = 0;
		score2 = 0;

		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	init();

	function create_snakes()
	{
		var length = 5;
    gameState = {
      p1_snake_array: [],
      p2_snake_array: [],
      p1_score: 0,
      p2_score: 0,
      p1_dir: 'right',
      p2_dir: 'left'
    };
		for(var i = length-1; i>=0; i--)
		{
			gameState.p1_snake_array.push({x: i, y:0});
			gameState.p2_snake_array.push({x: w/cw - i, y:h/cw-1});
		}
	}

	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};
	}

  function move_snake(gameState, player) {
    var snake = gameState[player+'_snake_array'];
    var dir = gameState[player+'_dir']
    var score = gameState[player+'_score'];

		var nx = snake[0].x;
		var ny = snake[0].y;
    if(dir == "right") nx++;
    else if(dir == "left") nx--;
    else if(dir == "up") ny--;
    else if(dir == "down") ny++;

    if(nx == -1) nx = w/cw-1;
    else if (nx == w/cw) nx = 0;

    if(ny == -1) ny = h/cw-1;
    else if (ny == h/cw) ny = 0;

		if(check_collision(nx, ny, snake))
		{
      endGame('Player '+player);
			init();
			return;
		}

		if(nx == food.x && ny == food.y) {
			var tail = {x: nx, y: ny};
			score++;
			create_food();
      snake.unshift(tail);
		}

		var tail = snake.pop();
		tail.x = nx; tail.y = ny;
		snake.unshift(tail);

		for(var i = 0; i < snake.length; i++)
		{
			var c = snake[i];
			paint_cell(c.x, c.y);
		}


    gameState[player+'_snake_array'] = snake;
    gameState[player+'_score'] = score;
    return gameState;
  }

	function paint()
	{
		ctx.clearRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

    gameState = move_snake(gameState, 'p1');
    gameState = move_snake(gameState, 'p2');

    ctx.fillStyle = '#fff';
		paint_cell(food.x, food.y);
		var score1_text = "P1 Score: " + gameState.p1_score;
		var score2_text = "P2 Score: " + gameState.p2_score;
    ctx.fillStyle = "#888"
    ctx.font = "20px sans-serif"
		ctx.fillText(score1_text, 5, h-5);
		ctx.fillText(score2_text, w-130, h-5);
	}

  function endGame(winner) {
    ctx.clearRect(0,0,w,h);
    ctx.font = "20px sans-serif";
    ctx.textAlign = 'center';
		ctx.fillText(winner+' wins', w/2, h/2);
  }

	function paint_cell(x, y)
	{
		ctx.fillStyle = "white";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "#111";
    ctx.lineWidth = 1;
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}

	window.addEventListener('keydown', function(e){
		var key = e.which || e.keyCode;
		if(key == "37" && gameState.p1_dir != "right") gameState.p1_dir = "left";
		else if(key == "38" && gameState.p1_dir != "down") gameState.p1_dir = "up";
		else if(key == "39" && gameState.p1_dir != "left") gameState.p1_dir = "right";
		else if(key == "40" && gameState.p1_dir != "up") gameState.p1_dir = "down";

		if(key == "37" && gameState.p2_dir != "right") gameState.p2_dir = "left";
		else if(key == "38" && gameState.p2_dir != "down") gameState.p2_dir = "up";
		else if(key == "39" && gameState.p2_dir != "left") gameState.p2_dir = "right";
		else if(key == "40" && gameState.p2_dir != "up") gameState.p2_dir = "down";
	})

});
