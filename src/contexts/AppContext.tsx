import * as SplashScreen from 'expo-splash-screen';
import firebase from 'firebase';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { fb } from '../api/firebase/Firebase';

const theme = {
	primary: '#121212',
	background: '#c4c4c4',
	elevation1: '#E4E4E4',
	elevation2: '#F0F2F4',
	elevation3: '#F3F3F3',
	beerBackground: ' #F5B160'
};

type FirebaseUser = firebase.User | null;

type AppContextType = {
	user: FirebaseUser;
	theme: typeof theme;
};

// Sets the correct types for context whenever it's imported
const AppContext = React.createContext({} as AppContextType);
export default AppContext;

// Provides values in all children components
const AppProvider: FunctionComponent = ({ children }) => {
	const [user, setUser] = useState<FirebaseUser>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const subscriber = fb.auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	const onAuthStateChanged = (user: FirebaseUser) => {
		if (loading) {
			setTimeout(() => {
				SplashScreen.hideAsync();
			}, 500);
			setLoading(false);
		}
		setUser(user);
	};

	return <AppContext.Provider value={{ user, theme }}>{children}</AppContext.Provider>;
};

export { AppProvider };
