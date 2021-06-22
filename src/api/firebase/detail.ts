import 'firebase/database';
import 'firebase/firestore';
import { fb } from './login';

const USERS = 'users';
const RATINGS ='ratings';
const USERS_COLLECTION = fb.firestore().collection(USERS);
const RATINGS_COLLECTION = fb.firestore().collection(RATINGS)
			

export const addUserRating = async (userID: string | null, userRating: number, breweryName: string) => {
    if (!userID) return () => {};
    USERS_COLLECTION.doc(userID).collection("ratings").doc(breweryName).set({
        userRating: userRating
    })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error: any) => {
        console.error("Error writing document: ", error);
    });
}

export const addOverallRating = async (userID: string | null, myRating: number, breweryName: string) => {
    if (!userID) return () => {};
    var overallRating = 5

    RATINGS_COLLECTION.doc(breweryName).set({
        rating: overallRating
    })
    .then(() => {
        console.log("Document successfully written 2!");
    })
    .catch((error: any) => {
        console.error("Error writing document: ", error);
    });
}

export const getUserRating = (userID: string | null, breweryName: string) => {
	if (!userID) return () => {};
	const message = USERS_COLLECTION.doc(userID)
		.collection(RATINGS)
        .doc(breweryName).get().then((doc) => {
            if (doc.exists) {
                console.log(doc.data())
                return doc.data()
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });    
        return message
}
