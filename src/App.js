import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Grid } from './Grid';
import { Solution } from './Solution';

function App() {
	return (
		<Router basename={`${process.env.PUBLIC_URL}`}>
			<div className="App">
				<header className="App-header">
					<h1><Link to="/">Advent of Code 2019</Link></h1>
				</header>
				<Switch>
					<Route exact path="/:day" component={Solution} />
					<Route exact path="/" component={Grid} />
					<Route path="/" component={p => <h2>404 - this puzzle does not exist!</h2>} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
