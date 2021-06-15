import 'firebase/database';
import 'firebase/firestore';

import firebase from 'firebase';
import { Alert, LogBox } from 'react-native';
import { firebaseConfig } from './FirebaseCredentials';

LogBox.ignoreLogs(['Setting a timer']);

export const fb = firebase.apps.length !== 0 ? firebase : firebase.initializeApp(firebaseConfig);

export async function register(email: any, password: any) {
	await fb
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then((r) => {
			const currentUser: any = r.user;

			const db = fb.firestore();
			db.collection('users').doc(currentUser.uid).set({
				email: currentUser.email
			});
		})
		.catch((e) => {
			Alert.alert('Ooops', e.message);
		});
}

export async function signIn(email: any, password: any) {
	await fb
		.auth()
		.signInWithEmailAndPassword(email, password)
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
