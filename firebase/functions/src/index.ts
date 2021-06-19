import axios from 'axios';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ChatDetail, Message, User } from '../types/Chat';

admin.initializeApp();

exports.newMessageNotification = functions.firestore
	.document('chats/{chat}/messages/{message}')
	.onCreate(async (snapshot, context) => {
		const message = snapshot.data() as Message;
		const senderID = message.senderID;

		const doc = await admin.firestore().doc(`chats/${context.params.chat}`).get();
		const { members, name } = doc.data() as ChatDetail;
		members
			.filter((member) => member.id !== senderID)
			.forEach((member) =>
				admin
					.firestore()
					.doc(`users/${member.id}`)
					.get()
					.then((userDoc) => {
						const { expoToken } = userDoc.data() as User;
						if (expoToken) {
							return axios.post(
								'https://exp.host/--/api/v2/push/send',
								{
									to: expoToken,
									sound: 'default',
									body: `${message.senderName}: ${message.content}`,
									title: name,
									data: {
										id: context.params.chat,
										name: name
									}
								},
								{
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									}
								}
							);
						} else {
							return new Promise(() => {});
						}
					})
			);
	});
