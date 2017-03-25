import React, { Component } from 'react';
import './Sass/App.scss';
//functional imports
import { Switch, Route } from 'react-router';
//Component imports
import Navbar from './Components/Navbar/Navbar.jsx';
import GamesMenu from './Components/GamesMenu/GamesMenu.jsx';
import ChatBar from './Components/ChatBar/ChatBar.jsx';
//Games imports
import Index from './Games/Index/Index.jsx';
import Pong from './Games/Pong/Pong.jsx';
import NotFound from './Games/NotFound/NotFound.jsx';

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			gameMenuOpen: true,
			chatBarOpen: true,
		};
	}
	handleGameMenuToggle(){
		this.setState({gameMenuOpen: !this.state.gameMenuOpen});
	}
	handleChatBarToggle(){
		this.setState({chatBarOpen: !this.state.chatBarOpen});
	}
	render() {
		return (
			<div className="App">
				<Navbar
					gameMenuToggle={() => this.handleGameMenuToggle()}
					gameMenuOpen={this.state.gameMenuOpen}
					chatBarToggle={() => this.handleChatBarToggle()}
					chatBarOpen={this.state.chatBarOpen}
				/>
				<GamesMenu open={this.state.gameMenuOpen} />
				<main>
					<Switch>
						<Route exact path="/" component={Index}/>
						<Route path="/pong" component={Pong} />
						<Route component={NotFound} />
					</Switch>
				</main>
				<ChatBar open={this.state.chatBarOpen} />
			</div>
		);
	}
}