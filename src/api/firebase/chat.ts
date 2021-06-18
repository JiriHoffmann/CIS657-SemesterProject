import 'firebase/database';
import 'firebase/firestore';

import { Alert, LogBox } from 'react-native';
import { ChatDetail, ChatMember, ChatPreview, Message } from '../../types/Chat';
import { fb } from './login';

LogBox.ignoreLogs(['Setting a timer']);

const CHATS = 'chats';
const USERS = 'users';
const MESSAGES = 'messages';
const CHATS_COLLECTION = fb.firestore().collection(CHATS);
const USERS_COLLECTION = fb.firestore().collection(USERS);

export const findUserByEmail = async (email: string) => {
	return await USERS_COLLECTION.where('email', '==', email.toLowerCase())
		.get()
		.then((res) => {
			const newUser = res.docs.map((doc) => ({
				id: doc.id,
				email: doc.data().email
			}))[0];
			if (!newUser) {
				throw 'User not found.';
			}
			return newUser;
		});
};

export const subscribeToChatsForUser = (userID: string | null, onChangeCallback: (chats: ChatPreview[]) => void) => {
	if (!userID) return () => {};
	return USERS_COLLECTION.doc(userID)
		.collection(CHATS)
		.orderBy('timestamp', 'desc')
		.onSnapshot((snapshot) => {
			const chats = snapshot.docs.map((doc) => {
				return { ...doc.data(), id: doc.id };
			});
			onChangeCallback(chats as ChatPreview[]);
		});
};

export const subscribeToChat = (
	chatID: string | null,
	updateDetail: boolean,
	onDetailChange: (detail: ChatDetail) => void,
	onMessageChange: (messages: Message[]) => void,
	messageLimit: number
) => {
	if (!chatID) return () => {};
	const chatRef = CHATS_COLLECTION.doc(chatID);
	if (updateDetail) {
		const asyncFunc = async () => {
			const data = (await chatRef.get()).data();
			onDetailChange({ id: chatID, ...data } as ChatDetail);
		};
		asyncFunc();
	}
	return chatRef
		.collection(MESSAGES)
		.orderBy('timestamp', 'desc')
		.limit(messageLimit)
		.onSnapshot((snapshot) => {
			const messages = snapshot.docs.map((doc) => {
				return doc.data();
			});
			onMessageChange(messages as Message[]);
		});
};

export const sendFirstMessage = async (
	sender: ChatMember,
	name: string,
	recievers: ChatMember[],
	content: string
): Promise<ChatDetail> => {
	const batch = fb.firestore().batch();
	const timestamp = Date.now();
	const chatRef = CHATS_COLLECTION.doc();
	const userChatRef = USERS_COLLECTION.doc(sender.id).collection(CHATS).doc(chatRef.id);

	// create the chat
	chatRef.collection(MESSAGES).add({
		timestamp,
		content,
		senderID: sender.id,
		senderName: sender.email
	});

	batch.set(chatRef, {
		name,
		createdAt: timestamp,
		members: [sender, ...recievers]
	});

	const userUpdate = {
		name,
		timestamp,
		content,
		senderID: sender.id,
		senderName: sender.email
	};

	// update chat for the user
	batch.set(userChatRef, userUpdate);

	// update chat for everyone else
	recievers.forEach((m) => {
		const otherUsersChatRef = USERS_COLLECTION.doc(m.id).collection(CHATS).doc(chatRef.id);
		batch.set(otherUsersChatRef, userUpdate);
	});

	batch.commit();

	return {
		id: chatRef.id,
		name,
		createdAt: `${timestamp}`,
		members: [sender, ...recievers]
	};
};

export const sendMessage = (sender: ChatMember, chatDetail: ChatDetail, content: string) => {
	const batch = fb.firestore().batch();
	const timestamp = Date.now();
	CHATS_COLLECTION.doc(chatDetail.id)
		.collection(MESSAGES)
		.doc()
		.set({ content, timestamp, senderID: sender.id, senderName: sender.email });

	chatDetail.members.forEach((m) => {
		const chatRef = USERS_COLLECTION.doc(m.id).collection(CHATS).doc(chatDetail.id);
		batch.update(chatRef, {
			name: chatDetail.name,
			timestamp,
			content,
			senderID: sender.id,
			senderName: sender.email
		});
	});

	batch.commit();
};
