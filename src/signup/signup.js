import React from 'react';
import { Link } from 'react-router-dom';

//Import Styles
import styles from './styles'

//MUI
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

//Firebase
const firebase = require('firebase')

class SignupComponent extends React.Component {
	constructor() {
		super();
		this.state = {
			email: null,
			password: null,
			passwordConfirmation: null,
			signupError: ''
		}
	}

	formIsValid = () => this.state.password === this.state.passwordConfirmation;


	submitSignup = (e) => {
		e.preventDefault()
		if(!this.formIsValid()){
			this.setState({ signupError: 'Password do not match'})
			return
		}

		firebase
			.auth()
			.createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then(authRes => {
				const userObj = {
					email: authRes.user.email,
				}
			firebase
				.firestore()
				.collection('users')
				.doc(this.state.email)
				.set(userObj)
				.then(() => {
					this.props.history.push('/dashboard')
				}, dbError => {
					console.log(dbError)
					this.setState({ signupError: 'Failed to add user'})
				})
			}, authError => {
				console.log(authError);
				this.setState({ signupError: 'Failed to add user'})
			})
	}

	userTyping = (whichInput, e) => {
		switch(whichInput) {
			case 'email':
			this.setState({ email: e.target.value})
			break;

			case 'password':
			this.setState({ password: e.target.value})
			break;

			case 'passwordConfirmation':
			this.setState({ passwordConfirmation: e.target.value})
			break;

			default:
			break;

		}
	}

	render() {
		const { classes } = this.props

		return (
			<main className={classes.main}>
				<CssBaseline></CssBaseline>
				<Paper className={classes.paper}>
					<Typography variant='h5' component='h1'>
						Sign Up
					</Typography>
					<form className={classes.form} onSubmit={(e) => this.submitSignup(e)}>
						<FormControl required fullWidth margin='normal'>
							<InputLabel htmlFor='signup-email-input'>Enter Your Email</InputLabel>
							<Input autoComplete='email' autoFocus id='signup-email-input' onChange={(e) => this.userTyping('email', e)} />
						</FormControl>
						<FormControl required fullWidth margin='normal'>
							<InputLabel htmlFor='signup-password-input'>Enter Your Password</InputLabel>
							<Input type='password' autoFocus id='signup-password-input' onChange={(e) => this.userTyping('password', e)} />
						</FormControl>
						<FormControl required fullWidth margin='normal'>
							<InputLabel htmlFor='signup-password-confirmation-input'>Enter Your Password</InputLabel>
							<Input type='password' autoFocus id='signup-password-confirmation-input' onChange={(e) => this.userTyping('passwordConfirmation', e)} />
						</FormControl>
						<Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Submit</Button>
					</form>
					{
						this.state.signupError ?
						<Typography className={classes.errorText} variant='h6' component='h5'>
							{this.state.signupError}
						</Typography> :
						null
					}
					<Typography variant='h6' component='h5' className={classes.hasAccountHeader}>
						Already have a account?
					</Typography>
					<Link className={classes.logInLink} to='/login'>Log In!</Link>
				</Paper>
			</main>
		)
	}
}

export default withStyles(styles)(SignupComponent);
