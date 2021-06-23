import { fb } from './login';

const USERS = 'users';
const RATINGS = 'ratings';
const USERS_COLLECTION = fb.firestore().collection(USERS);
const RATINGS_COLLECTION = fb.firestore().collection(RATINGS);

export const addUserRating = async (userID: string, userRating: number, breweryID: string) => {
	USERS_COLLECTION.doc(userID).collection('ratings').doc(breweryID).set({
		userRating: userRating
	});

	return fb.firestore().runTransaction(async () => {
		// Get post data first
		const ratingsRef = RATINGS_COLLECTION.doc(breweryID);

		if (!(await ratingsRef.get()).exists) {
			ratingsRef.set({ rating: userRating, count: 1 });
		} else {
			const prevData = (await ratingsRef.get()).data();
			if (prevData) {
				const newRating = (prevData.rating * prevData.count + userRating) / (prevData.count + 1);
				ratingsRef.update({ rating: newRating, count: prevData.count + 1 });
			} else {
				throw Error;
			}
		}
	});
};

export const getUserRating = async (userID: string, breweryName: string) => {
	return await USERS_COLLECTION.doc(userID)
		.collection(RATINGS)
		.doc(breweryName)
		.get()
		.then((snap) => {
			return snap.data()?.userRating as number | undefined;
		});
};

export const getOverallRating = async (breweryName: string) => {
	return await RATINGS_COLLECTION.doc(breweryName)
		.get()
		.then((doc) => {
			return doc.data()?.rating as number | undefined;
		});
};
