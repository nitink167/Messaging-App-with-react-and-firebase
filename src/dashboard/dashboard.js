import React from 'react';
import {Button, withStyles} from '@material-ui/core/';
import styles from './styles'
import ChatListComponent from '../chatList/chatList';
import ChatViewComponent from '../chatView/chatView';
import ChatTextBoxComponent from '../chatTextBox/chatTextBox';
import NewChatComponent from '../newChat/newChat';

const firebase = require('firebase')

class DashboardComponent extends React.Component {

	constructor(){
		super();
		this.state = {
			selectedChat: null,
			newChatFormVisible: false,
			email: null,
			chats: []
		}
	}

	newChatBtnClicked = () => {
		this.setState({
			newChatFormVisible: true,
			selectChat: null
		})
	}

	messageRead = () => {
		const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_user => _user !== this.state.email)[0]);

		if(this.clicketChatWhereNotSender(this.state.selectedChat)) {
			firebase
				.firestore()
				.collection('chats')
				.doc(docKey)
				.update({
					receiverHasRead: true
				})
		} else {
			console.log('Clicked where user is sender')
		}
	}

	clicketChatWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;

	selectChat = async (chatIndex) => {
		await this.setState({
			selectedChat: chatIndex,
			newChatFormVisible: false
		})
		this.messageRead();
	}

	signOut = () => {
		firebase.auth().signOut()
	}

	submitMessage = (msg) => {
		const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_user => _user !== this.state.email)[0])
		firebase
			.firestore()
			.collection('chats')
			.doc(docKey)
			.update({
				messages: firebase.firestore.FieldValue.arrayUnion({
					sender: this.state.email,
					message: msg,
					timestamp: Date.now()
				}),
				receiverHasRead: false
			})
	}

	buildDocKey = (friend) => [this.state.email, friend].sort().join(':');

	goToChat = async (docKey, msg) => {
		const usersInChat = docKey.split(':')
		const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)))
		this.setState({newChatFormVisible: false})
		await this.selectChat(this.state.chats.indexOf(chat))
		this.submitMessage(msg)
	}

	newChatSubmit = async (chatObj) => {
		const docKey = this.buildDocKey(chatObj.sendTo);
		await firebase
			.firestore()
			.collection('chats')
			.doc(docKey)
			.set({
				receiverHasRead: false,
				users: [this.state.email, chatObj.sendTo],
				messages: [{
					message: chatObj.message,
					sender: this.state.email
				}]
			})
		this.setState({ newChatFormVisible: false})
		this.selectChat(this.state.chats.length - 1 )
	}

	componentDidMount = () => {
		firebase
			.auth()
			.onAuthStateChanged( async _user => {
				if(!_user){
					this.props.history.push('/login')
				}
			else {
				await firebase
						.firestore()
						.collection('chats')
						.where('users', 'array-contains', _user.email)
						.onSnapshot(async res => {
							const chats = res.docs.map(_doc => _doc.data())
							await this.setState({
								email: _user.email,
								chats
							})
						})
			}
			})
	}

	render() {
		const {classes} = this.props;
		return (
			<div>
				<ChatListComponent
					history={this.props.history}
					newChatBtnFn={this.newChatBtnClicked}
					selectedChatFn={this.selectChat}
					chats={this.state.chats}
					userEmail={this.state.email}
					selectedChatIndex={this.state.selectedChat}
				/>
				{
					this.state.newChatFormVisible ?
						null :
						<ChatViewComponent user={this.state.email} chats={this.state.chats[this.state.selectedChat]}/>
				}
				{
					this.state.selectedChat !== null && !this.state.newChatFormVisible ?
						<ChatTextBoxComponent messageReadFn={this.messageRead} submitMessageFn={this.submitMessage}/> :
						null
				}
				{
					this.state.newChatFormVisible ? <NewChatComponent goToChatFn={this.goToChat} newChatSubmitFn={this.newChatSubmit}/> : null
				}
				<Button onClick={this.signOut} className={classes.signOutBtn}>
					Sign Out
				</Button>
			</div>
		)
	}
}

export default withStyles(styles)(DashboardComponent);
