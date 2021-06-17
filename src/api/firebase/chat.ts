import 'firebase/database';
import 'firebase/firestore';

import { Alert, LogBox } from 'react-native';
import { AddNewUser } from '../../types/Chat';
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
