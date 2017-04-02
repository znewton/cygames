import React, { Component } from 'react';
import './Sass/App.scss';
//functional imports
import { Switch, Route } from 'react-router-dom';
import firebase from 'firebase';
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
		if(window.innerWidth < 962) {
			this.state = {
				gameMenuOpen: false,
				chatBarOpen: false,
			};
		} else {
			this.state = {
				gameMenuOpen: true,
				chatBarOpen: true,
			};
		}
		this.state.userDetails = null;
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if(firebaseUser) {
				//user is signed in
				firebaseUser.getToken().then(accessToken => {
					this.setState({
						userDetails:{
							displayName: firebaseUser.displayName,
							email: firebaseUser.email,
							emailVerified: firebaseUser.emailVerified,
							photoURL: firebaseUser.photoURL,
							uid: firebaseUser.uid,
							accessToken: accessToken,
							providerData: firebaseUser.providerData,
						}
					});
				});
			} else {
				this.setState({
					userDetails: null,
				});
			}
		}, error => {
			console.log(error);
		})
	}
	handleLogin() {
		if (firebase.auth().currentUser) return;
		firebase.auth().signInWithPopup(this.props.provider)
			.then(result => {
				let token = result.credential.accessToken;
				let googleUser = result.user;
				let unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
					unsubscribe();
					if (!this.isUserEqual(googleUser, firebaseUser)) {
						let credential = firebase.auth.GoogleAuthProvider.credential(
							googleUser.getAuthResponse().id_token);
						firebase.auth().signInWithCredential(credential).catch(error => {console.log(error)});
					} else {
						console.log('User already signed-in Firebase');
					}
				}, error => {console.log(error)});
			})
			.catch(error => {console.log(error)});

	}
	handleGameMenuToggle(){
		this.setState({gameMenuOpen: !this.state.gameMenuOpen, chatBarOpen: window.innerWidth < 962 ? false : this.state.chatBarOpen});
	}
	handleChatBarToggle(){
		this.setState({chatBarOpen: !this.state.chatBarOpen, gameMenuOpen: window.innerWidth < 962 ? false : this.state.gameMenuOpen});
	}
	handleGameChange() {
		if(window.innerWidth >= 962) return;
		this.setState({gameMenuOpen: false})
	}
	render() {
		return (
			<div className="App">
				<Navbar
					gameMenuToggle={() => this.handleGameMenuToggle()}
					gameMenuOpen={this.state.gameMenuOpen}
					chatBarToggle={() => this.handleChatBarToggle()}
					chatBarOpen={this.state.chatBarOpen}
					login={()=> this.handleLogin()}
					user={this.state.userDetails}
				/>
				<GamesMenu
					open={this.state.gameMenuOpen}
					routes={this.props.routes.map(route => ({ path: route.path, label: route.label }))}
					handleGameChange={() => this.handleGameChange()}
				/>
				<Main
					gameMenuOpen={this.state.gameMenuOpen}
					chatBarOpen={this.state.chatBarOpen}
				>
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

App.propTypes = {
	routes: React.PropTypes.array.isRequired,
	provider: React.PropTypes.object,
};