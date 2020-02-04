import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router} from 'react-router-dom';
import LoginComponent from './login/login';
import SignupComponent from './signup/signup';
import DashboardComponent from './dashboard/dashboard';

const firebase = require('firebase');
require('firebase/firestore')

firebase.initializeApp({
	apiKey: "AIzaSyAuHMAFLEanixng8pXPPwvDD2kAcmMlapc",
    authDomain: "instant-messaging-55c5c.firebaseapp.com",
    databaseURL: "https://instant-messaging-55c5c.firebaseio.com",
    projectId: "instant-messaging-55c5c",
    storageBucket: "instant-messaging-55c5c.appspot.com",
    messagingSenderId: "976709330860",
    appId: "1:976709330860:web:15c939487e2b15d1f93c09",
    measurementId: "G-4D96EQ4JVK"
})

const routing = (
	<Router>
		<div id='routing-container'>
			<Route path='/login' component={LoginComponent}></Route>
			<Route path='/signup' component={SignupComponent}></Route>
			<Route path='/dashboard' component={DashboardComponent}></Route>
		</div>
	</Router>
)

ReactDOM.render(routing, document.getElementById('root'));
