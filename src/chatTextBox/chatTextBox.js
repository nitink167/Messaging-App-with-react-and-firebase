import React from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';

class ChatTextBoxComponent extends React.Component {

	constructor() {
		super();
		this.state = {
			chatText: ''
		}
	}

	userTyping = (e) => {
		e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value})
	}

	messageValid = (text) => text && text.replace(/\s/g, '').length;

	userClickedInput = () => this.props.messageReadFn()

	submitMessage = () => {
		if(this.messageValid(this.state.chatText)){
			this.props.submitMessageFn(this.state.chatText)
			document.getElementById('chattextbox').value = ''
		}
	}

	render() {
		const { classes} = this.props

		return(
			<div className={classes.chatTextBoxContainer}>
				<TextField id='chattextbox' placeholder='Type you message' onKeyUp={(e) => this.userTyping(e)} className={classes.chatTextBox} onFocus={this.userClickedInput}/>
				<Send onClick={this.submitMessage} className={classes.sendBtn}/>
			</div>
		)
	}
}

export default withStyles(styles)(ChatTextBoxComponent)
