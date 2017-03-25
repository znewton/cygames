import React, { Component } from 'react';
import './Sass/App.scss';
//functional imports
import { Switch, Route } from 'react-router';
//Component imports
import Navbar from './Components/Navbar/Navbar.jsx';
import GamesMenu from './Components/GamesMenu/GamesMenu.jsx';
import ChatBar from './Components/ChatBar/ChatBar.jsx';
import Main from './Components/Main/Main.jsx';
//View Imports
import Index from './Games/Index/Index.jsx';
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
				<GamesMenu
					open={this.state.gameMenuOpen}
					routes={this.props.routes}
				/>
				<Main>
					<Switch>
						<Route exact path="/" component={Index}/>
						{this.props.routes.map((route) => <Route path={'/'+route.path} component={route.component} key={route.path} />)}
						<Route component={NotFound} />
					</Switch>
				</Main>
				<ChatBar
					open={this.state.chatBarOpen}
				/>
			</div>
		);
	}
}