var myGamePiece;
var myObstacles = [];
var myScore;
var bullets = [];
var movementValue = 2;

function startGame() {
    document.addEventListener('keydown', function(event) {
    if(event.keyCode == 38) { //Up
        accelerateY(-movementValue);
    }
    else if(event.keyCode == 40) { //Down
        accelerateY(movementValue);
    }
    else if(event.keyCode == 39){ //Right
        accelerateX(-movementValue);
    }
    else if(event.keyCode == 37){ //Left
        accelerateX(movementValue);
    }
    else if(event.keyCode == 32){ //Spacebar
        //Fire Bullet
        bullets.push(new bullet(5,5,"black",player1.x,player1.y,"player1"));
    }
    if(event.keyCode == 87) { //w
        accelerateYP2(-2);
    }
    else if(event.keyCode == 83) { //s
        accelerateYP2(2);
    }
    else if(event.keyCode == 65){ //a
        accelerateXP2(2);
    }
    else if(event.keyCode == 68){ //d
        accelerateXP2(-2);
    }
    else if(event.keyCode == 70){ //f
        //Fire Bullet
        bullets.push(new bullet(5,5,"black",player2.x,player2.y,"player2"));
    }
});
    player1 = new component(30, 30, "red", 10, 120);
    player2 = new component(30, 30, "blue", 300, 120);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        generateLevel();
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
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

function generateLevel(){
    myObstacles.push(new component(10, 50, "green", 50, 120));
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        for(j =0; j<bullets.length;j++){
            if (bullets[j].crashWith(myObstacles[i])){
                bullets.splice(j,1);
            }
        }
        if(myObstacles[i].crashWith(player1)){

        }
        if(myObstacles[i].crashWith(player2)){

        }
    }
    for(i=0;i < bullets.length;i++){
        if(bullets[i].crashWith(player1) && bullets[i].shooter != "player1"){
            bullets.splice(i,1);
            alert("player 2 gets the w.");
            return;
        }
        if(bullets[i].crashWith(player2) && bullets[i].shooter != "player2"){
            bullets.splice(i,1);
            alert("player 1 gets the w.");
            return;
        }
    }
    myGameArea.clear();
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].update();
    }
    for (i = 0; i < bullets.length; i += 1) {
        bullets[i].newPos();
        bullets[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    player1.newPos();
    player1.update();
    player2.newPos();
    player2.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerateX(n) {
    player1.x -= n;
}
function accelerateY(n) {
    player1.y += n;
}
function accelerateXP2(n) {
    player2.x -= n;
}
function accelerateYP2(n) {
    player2.y += n;
}
