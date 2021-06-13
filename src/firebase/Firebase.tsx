import firebase from 'firebase'
import 'firebase/database';
import "firebase/firestore";
import { firebaseConfig } from './FirebaseCredentials';

export function initDb(){
    firebase.initializeApp(firebaseConfig)
}

export function write(key: any, data: any){
    firebase.database().ref(`Logins/${key}`).set(data)
}

export async function registration(email: any, password: any) {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const currentUser: any = firebase.auth().currentUser;
  
      const db = firebase.firestore();
      db.collection("users")
        .doc(currentUser.uid)
        .set({
          email: currentUser.email,
        });
    } catch (err) {
      console.log(err)
    }
  }

  export async function signIn(email: any, password: any) {
    var hadError = false
    try {
     await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
        console.log("signing in")
    } catch (err) {
      console.log(err)
    }
  }

  export async function loggingOut() {
    try {
      await firebase.auth().signOut();
      console.log("loggin out")
    } catch (err) {
      console.log(err)
    }
  }

export function setUpData(key: any){
    firebase.database().ref(`Logins${key}`)
    .on('value', (snapshot) => {
        console.log(snapshot);
    });
}