import firebase from 'firebase'
import 'firebase/database';
import { firebaseConfig } from './FirebaseCredentials';

export function initDb(){
    firebase.initializeApp(firebaseConfig)
}

export function write(key: any, data: any){
    firebase.database().ref(`Logins/${key}`).set(data)
}

export function setUpData(key: any){
    firebase.database().ref(`Logins${key}`)
    .on('value', (snapshot) => {
        console.log(snapshot);
    });
}