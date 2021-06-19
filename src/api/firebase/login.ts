import 'firebase/database';
import 'firebase/firestore';

import * as Notifications from 'expo-notifications';
import firebase from 'firebase';
import { Alert, LogBox } from 'react-native';
import { registerForPushNotificationsAsync } from '../../scripts/registerForPushNotifications';
import { firebaseConfig } from './FirebaseCredentials';

LogBox.ignoreLogs(['Setting a timer']);

export const fb = firebase.apps.length !== 0 ? firebase : firebase.initializeApp(firebaseConfig);

export async function register(email: any, password: any) {
	await fb
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then(async (r) => {
			const currentUser: any = r.user;
			const token = await registerForPushNotificationsAsync().catch(() => {});

			const db = fb.firestore();
			db.collection('users')
				.doc(currentUser.uid)
				.set(
					token
						? {
								email: currentUser.email,
								expoToken: token
						  }
						: {
								email: currentUser.email
						  }
				);
		})
		.catch((e) => {
			Alert.alert('Ooops', e.message);
		});
}

export async function signIn(email: any, password: any) {
	await fb
		.auth()
		.signInWithEmailAndPassword(email, password)
		.then(async (r) => {
			const currentUser: any = r.user;
			const token = await registerForPushNotificationsAsync().catch(() => {});
			if (token) {
				const db = fb.firestore();
				db.collection('users').doc(currentUser.uid).update({
					expoToken: token
				});
			}
		})
		.catch((e) => {
			Alert.alert('Ooops', e.message);
		});
}

export async function logOut() {
	await firebase
		.auth()
		.signOut()
		.catch((e) => Alert.alert('Ooops', e.message));
}
