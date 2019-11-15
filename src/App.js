import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
	return (
		<Router basename={`${process.env.PUBLIC_URL}`}>
			<div className="App">
				<header className="App-header">
					<h1>Advent of Code 2019</h1>
				</header>
				<Switch>
					<Route exact path="/" component={p => <p>Heyyy!</p> } />
					<Route path="/" component={p => <h2>404 - this puzzle does not exist!</h2> } />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
