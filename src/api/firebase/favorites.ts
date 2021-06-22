import firebase from 'firebase';
import 'firebase/database'
import { firebaseConfig } from './FirebaseCredentials'


export function writeData (item: any) {
    firebase.database().ref(`favoriteData/`).push(item);
}

export function deleteFavorite(item: any){
    firebase.database().ref(`favoriteData/${item.id}`).remove();
}

export function setUpListener(updateFunc: any){
    firebase
    .database()
    .ref(`favoriteData/`)
    .on('value', (snapshot) => {
        console.log('Data is ', snapshot);
        if(snapshot?.val()){
            const fbObject = snapshot.val();
            const newArr: string | any = [];
            Object.keys(fbObject).map((key, index) => {
                console.log(key, '||', index, '||', fbObject[key]);
                //add way to check for duplicate so only one favorite shows up
                newArr.push(fbObject[key]);
            });
            updateFunc(newArr);
        } else{
            updateFunc([]);
        }
    });
}