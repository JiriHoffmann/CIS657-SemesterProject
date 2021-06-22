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
    var sum = 0
    var counter = 0

    USERS_COLLECTION.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            USERS_COLLECTION.doc(doc.id)
		.collection(RATINGS)
        .doc(breweryName).get().then((doc) => {
            if (doc.exists) {
                counter++
                var data: any = doc.data()
                sum += data.userRating
                
                RATINGS_COLLECTION.doc(breweryName).set({
                    rating: (sum/counter)
                })
                .then(() => {
                    console.log("Document successfully written 2!");
                })
                .catch((error: any) => {
                    console.error("Error writing document: ", error);
                });
            }
        })
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

export const getUserRating = async (userID: string | null, breweryName: string) => {
	if (!userID) return () => {};
	return await  USERS_COLLECTION.doc(userID)
		.collection(RATINGS)
        .doc(breweryName).get().then((doc) => {
            if (doc.exists) {
                return doc.data()
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error: any) => {
            console.error("Error writing document: ", error);
        }); 
}

export const getOverallRating = async (breweryName: string) => {
	return await  RATINGS_COLLECTION.doc(breweryName).get().then((doc) => {
            if (doc.exists) {
                return doc.data()
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error: any) => {
            console.error("Error writing document: ", error);
        }); 
}