import React from 'react';
import { render } from 'react-dom';
import './Sass/index.scss';
//functional imports
import { Router } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
//Component imports
import App from './App.jsx';

const history = createBrowserHistory();

render((
	<Router history={history}>
		<App />
	</Router>
), document.getElementById('root'));