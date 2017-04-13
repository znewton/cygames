import React, { Component } from 'react';

import Canvas from '../Canvas.jsx';

let context = null;

export default class Tanks extends Component {
  constructor() {
    super();
    // Set game defaults
    this.state = {
      userDetails: null,
      showButton: false,
      queue: false,
      starting: false,
    };
    // Set document title
    document.title = 'Tanks cygames';
  }
  componentDidMount() {
    //Handle socket events
    this.props.socket.emit("tanks:enterQueue");
    this.setState({queue: true}); // Set Queue state
    this.props.socket.on('tanks:update-server',(data) => {
      this.canvasUpdate(context, data); // Update the canvas when game is actually being played
    });
    this.props.socket.on('tanks:end',(data) => {
      this.canvasGameEnd(context, data); // Show end game details
    });
    this.props.socket.on('tanks:start',(data) => {
      this.canvasGameStart(context, data); // Set Game start. Could potentially be altered to have opponent info
    });
    this.props.socket.on('tanks:enterQueue',(data) => {
      this.setState({queue: true}); // Set Queue state
    });
  }
  canvasGameStart(ctx, data) {
    this.setState({queue:false,starting:true}); // End Queue state, start countdown
    setTimeout(()=> {
      this.setState({starting: false});
    }, 3100); // end countdown after 3.1 seconds
  }
  canvasGameEnd(ctx, data) {
    ctx.clearRect(0,0,ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
		ctx.font= '20px courier';
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';
		if(data.quitter !== null) { // Display if opponent quits
			ctx.fillStyle = '#c82345';
			ctx.fillText('Player '+data.quitter+' Quit!',
										ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
		} else { // Display which player won or tie
			let pNum = this.props.user.uid === data.p1_id ? 1 : 2;
			if(data.p1_lives > data.p2_lives) {
			  ctx.fillStyle = pNum === 1 ? '#1da1f2' : '#c82345';
				ctx.fillText('Player 1 Wins!',
											ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
			} else if (data.p1_lives < data.p2_lives) {
				ctx.fillStyle = pNum === 2 ? '#1da1f2' : '#c82345';
				ctx.fillText('Player 2 Wins!',
											ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
			} else {
				ctx.fillStyle = '#fff';
				ctx.fillText('Tie!',
											ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.3);
			}
		}
		// Display final score
		ctx.fillText('Final Score:',
									ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.5);
		ctx.fillText(data.p1_lives+' to '+data.p2_lives,
									ctx.canvas.offsetWidth/2, ctx.canvas.offsetHeight*0.7);
		this.setState({showButton: true});
  }
  canvasUpdate(ctx, gameState) {
    for(i=0;i < gameState.bullets.length;i++){
        if(gameState.bullets[i].crashWith(gameState.p1) && gameState.bullets[i].shooter != "player1"){
            gameState.bullets.splice(i,1);
            alert("player 2 gets the w.");
            return;
        }
        if(gameState.bullets[i].crashWith(gameState.p2) && gameState.bullets[i].shooter != "player2"){
            gameState.bullets.splice(i,1);
            alert("player 1 gets the w.");
            return;
        }
    }
    for (i = 0; i < gameState.bullets.length; i += 1) {
        gameState.bullets[i].newPos();
        gameState.bullets[i].update();
    }
    gameState.p1.newPos();
    gameState.p1.update();
    gameState.p2.newPos();
    gameState.p2.update();
  }

  handleMount(ctx) {
		// Set the component context to draw on for game updates
		context = ctx;
		// Set the game controls, Should probably change to be on the canvas, not window
		window.addEventListener('keydown', (e) =>  {
			let code = e.which || e.keyCode;
      let fire = false;
      let offsetX = 0;
      let offsetY = 0;
			if(code === 37) { //left
				offsetX = -1;
			} else if(code === 38) { //up
				offsetY = 1;
			} else if(code === 39) { //right
				offsetX = 1;
			} else if(code === 40) { //down
				offsetY = -1;
			}else if(code === 32){ //spacebar
        fire = true;
      }
			// Send update only if valid movement
			if (dir === '' && !fire) return;
			e.preventDefault();
			this.props.socket.emit('tanks:update-client', {offsetY: offsetY, offsetX: offsetX, fire:fire});
		})
	}
  componentWillUnmount() {
    // Disconnect socket if user exits window or goes to different page.
    this.props.socket.emit('unmount');
  }
  render() {
    return (
      <div className="Tanks">
        <Canvas handleMount={(ctx) => this.handleMount(ctx)}
          starting={this.state.starting}
          queue={this.state.queue}
        />
        {this.state.showButton &&
        <p style={{textAlign: 'center', fontSize: '2em'}}>
          Refresh <i className="fa fa-refresh" /> to re-enter Queue
        </p>
        }
        <p className="game-description">
          You are the <span style={{backgroundColor: '#1da1f2', color: '#fff'}}>Blue</span> Tank. <br/>
          Use the arrow keys to move. Spacebar to shoot. <br />
          Hit the other tank to win.
        </p>
      </div>
    );
  }
}
