import React from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';

class ChatViewComponent extends React.Component {

	componentDidUpdate = () => {
		const container = document.getElementById('chatview-container')
		if(container){
			container.scrollTo(0, container.scrollHeight);
		}
	}

	render() {
		const { classes, chats, user } = this.props

		if(chats === undefined) {
			return(
				<main id='chatview-container' className={classes.content}>
				</main>
			)
		} else {
			return(
				<div>
					<div className={classes.chatHeader}>
						{chats.users.filter(_user => _user !== user)[0]}

					</div>
					<main id='chatview-container' className={classes.content}>
						{
							chats.messages.map((_msg, _index) => {
								return(
										<div key={_index} className={_msg.sender === user ? classes.userSent : classes.friendSent}>
											{_msg.message}
										</div>
								)
							})
							// {
							// 	!_msg.timestamp ? null : <div className={classes.timestamp}>{_msg.timestamp}</div>
							// }
						}
					</main>

				</div>
			)
		}
	}
}

export default withStyles(styles)(ChatViewComponent)
