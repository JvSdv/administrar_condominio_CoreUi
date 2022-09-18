import React, { Component } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import "./scss/style.scss";

const loading = (
	<div className="pt-3 text-center">
		<div className="sk-spinner sk-spinner-pulse"></div>
	</div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/Login"));

function App() {
	return (
		<BrowserRouter>
			<React.Suspense fallback={loading}>
				{/* prettier-ignore */}
				<Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route path="/" name="Home" render={props => <TheLayout {...props}/>} />
            </Switch>
			</React.Suspense>
		</BrowserRouter>
	);
}

export default App;
