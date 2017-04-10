document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	var w = canvas.width;
	var h = canvas.height;

	var cw = Math.ceil(w/50);
	var d1;
  var d2;
	var food;
	var score1;
	var score2;

	var p1_snake_array;
	var p2_snake_array;

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
		var length1 = 5;
		p1_snake_array = [];
		p2_snake_array = [];
		for(var i = length-1; i>=0; i--)
		{
			p1_snake_array.push({x: i, y:0});
			p1_snake_array.push({x: w/cw - i, y:h/cw-1});
		}
	}

	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};
	}

  function move_snake(snake, dir, score) {
		var nx = pl_snake_array[0].x;
		var ny = pl_snake_array[0].y;
    if(dir == "right") nx++;
    else if(dir == "left") nx--;
    else if(dir == "up") ny--;
    else if(dir == "down") ny++;

    if(nx == -1) nx = w/cw-1;
    else if (nx == w/cw) nx = 0;

    if(ny == -1) ny = h/cw-1;
    else if (ny == h/cw) ny = 0;

		if(nx == food.x && ny == food.y) {
			var tail = {x: nx, y: ny};
			score++;
			create_food();
  		p1_snake_array.unshift(tail);
		}

		var tail = p1_snake_array.pop();
		tail.x = nx; tail.y = ny;


		p1_snake_array.unshift(tail);

    return snake;
  }

	function paint()
	{
		ctx.clearRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);



		if(check_collision(nx, ny, p1_snake_array))
		{
      endGame();
			init();
			return;
		}


		for(var i = 0; i < p1_snake_array.length; i++)
		{
			var c = p1_snake_array[i];
			paint_cell(c.x, c.y);
		}
    ctx.fillStyle = '#fff';
		paint_cell(food.x, food.y);
		var score_text = "Score: " + score;
    ctx.fillStyle = "#888"
    ctx.font = "20px sans-serif"
		ctx.fillText(score_text, 5, h-5);
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
		for(var i = 0; i < array1.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}

	window.addEventListener('keydown', function(e){
		var key = e.which || e.keyCode;
		if(key == "37" && d1 != "right") d1 = "left";
		else if(key == "38" && d1 != "down") d1 = "up";
		else if(key == "39" && d1 != "left") d1 = "right";
		else if(key == "40" && d1 != "up") d1 = "down";

		if(key == "37" && d2 != "right") d2 = "left";
		else if(key == "38" && d2 != "down") d2 = "up";
		else if(key == "39" && d2 != "left") d2 = "right";
		else if(key == "40" && d2 != "up") d2 = "down";
	})

});
