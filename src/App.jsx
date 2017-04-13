import React, { Component } from 'react';
import './Sass/App.scss';
//functional imports
import { Switch, Route } from 'react-router-dom';
//Component imports
import Navbar from './Components/Navbar/Navbar.jsx';
import GamesMenu from './Components/GamesMenu/GamesMenu.jsx';
import ChatBar from './Components/ChatBar/ChatBar.jsx';
import Main from './Components/Main/Main.jsx';
//View Imports
import Index from './Games/Index/Index.jsx';
import NotFound from './Games/NotFound/NotFound.jsx';
import Pong from './Games/Pong/Pong.jsx';
import Snake from './Games/Snake/Snake.jsx';
import Chess from './Games/Chess/Chess.jsx';

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			gameMenuOpen: false,
			chatBarOpen: false,
			userMenuOpen: false
		};
	}
	componentDidMount() {
		if(this.props.user) {
			this.handleGameMenuToggle();
			this.handleChatBarToggle();
		}
	}
	handleGameMenuToggle(){
		this.setState({gameMenuOpen: !this.state.gameMenuOpen, chatBarOpen: window.innerWidth < 962 ? false : this.state.chatBarOpen});
	}
	handleChatBarToggle(){
		this.setState({chatBarOpen: !this.state.chatBarOpen, gameMenuOpen: window.innerWidth < 962 ? false : this.state.gameMenuOpen});
	}
	handleUserMenuToggle(){
		this.setState({userMenuOpen: !this.state.userMenuOpen});
	}
	handleGameChange() {
		if(window.innerWidth >= 962) return;
		this.setState({gameMenuOpen: false})
	}
	unmountSocket() {
	  console.log('unmount');
	  this.props.socket.emit('socket:unmount')
 	}
	render() {
		const PongWrapper = () => (<div className="PongWrapper"><Pong socket={this.props.socket} user={this.props.user} /></div>);
		const SnakeWrapper = () => (<div className="SnakeWrapper"><Snake socket={this.props.socket} user={this.props.user} /></div>);
		const ChessWrapper = () => (<div className="ChessWrapper"><Chess socket={this.props.socket} user={this.props.user} /></div>);
		const routes = [
			{path: 'pong', label: 'Pong'},
			{path: 'snake', label: 'Snake'},
			{path: 'chess', label: 'Chess'},
		];
		return (
			<div className="App">
				<Navbar
					gameMenuToggle={() => this.handleGameMenuToggle()}
					gameMenuOpen={this.state.gameMenuOpen}
					chatBarToggle={() => this.handleChatBarToggle()}
					chatBarOpen={this.state.chatBarOpen}
					userMenuToggle={() => this.handleUserMenuToggle()}
					userMenuOpen={this.state.userMenuOpen}
					login={()=> this.props.handleLogin()}
					logout={()=> this.props.handleLogout()}
					user={this.props.user}
					onRouteChange={() => this.unmountSocket()}
				/>
				<GamesMenu
					open={this.state.gameMenuOpen}
					routes={routes}
					handleGameChange={() => this.handleGameChange()}
				/>
				<Main
					gameMenuOpen={this.state.gameMenuOpen}
					chatBarOpen={this.state.chatBarOpen}
				>
				{this.props.user != null ?
					<Switch>
						<Route exact path="/" component={Index}/>
						<Route path={'/pong'} component={PongWrapper} />
						<Route path={'/snake'} component={SnakeWrapper} />
						<Route path={'/chess'} component={ChessWrapper} />
						<Route component={NotFound} />
					</Switch> :
					<Switch>
						<Route exact path="/" component={Index}/>
						<Route component={NotFound} />
					</Switch>
				}
				</Main>
				<ChatBar
					open={this.state.chatBarOpen}
					socket={this.props.socket}
					user={this.props.user}
				/>
			</div>
		);
	}
}

App.propTypes = {
	routes: React.PropTypes.array.isRequired,
	provider: React.PropTypes.object,
};
