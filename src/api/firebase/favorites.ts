import { BeerLocation } from '../../types/BeerMapping';
import { fb } from './login';

const USERS = 'users';
const FAVOURITES = 'favourites';
const USERS_COLLECTION = fb.firestore().collection(USERS);

export const saveFavourite = async (userID: string, item: BeerLocation) => {
	const timestamp = Date.now();
	return USERS_COLLECTION.doc(userID)
		.collection(FAVOURITES)
		.doc(item.id)
		.set({ ...item, timestamp });
};

export const deleteFavourite = async (userID: string, id: string) => {
	return USERS_COLLECTION.doc(userID).collection(FAVOURITES).doc(id).delete();
};

export const checkIfInFavourites = async (userID: string, id: string) => {
	return USERS_COLLECTION.doc(userID)
		.collection(FAVOURITES)
		.doc(id)
		.get()
		.then((item) => item.exists)
		.catch((error) => {
			console.log('Error getting document:', error);
			return false;
		});
};
export const subscribeToFavouritesForUser = (
	userID: string | null,
	onChangeCallback: (favourites: BeerLocation[]) => void
) => {
	if (!userID) return () => {};
	return USERS_COLLECTION.doc(userID)
		.collection(FAVOURITES)
		.orderBy('timestamp', 'desc')
		.onSnapshot((snapshot) => {
			const locations = snapshot.docs.map((doc) => {
				return doc.data();
			});
			onChangeCallback(locations as BeerLocation[]);
		});
};
