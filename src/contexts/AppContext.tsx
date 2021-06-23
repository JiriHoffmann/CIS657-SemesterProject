import * as SplashScreen from 'expo-splash-screen';
import firebase from 'firebase';
import React, { FunctionComponent, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fb } from '../api/firebase/login';
import { theme1, theme2, theme3, theme4 } from '../constants/Themes';

type FirebaseUser = firebase.User | null;

type Theme = typeof theme1;

type AppContextType = {
	user: FirebaseUser;
	theme: Theme;
	changeTheme: (newTheme: string) => void;
};

const getThemeFromString = (theme: string) => {
	switch (theme) {
		case 'theme1':
			return theme1;
		case 'theme2':
			return theme2;
		case 'theme3':
			return theme3;
		case 'theme4':
			return theme4;
		default:
			return theme1;
	}
};

// Sets the correct types for context whenever it's imported
const AppContext = React.createContext({} as AppContextType);
export default AppContext;

// Provides values in all children components
const AppProvider: FunctionComponent = ({ children }) => {
	const [user, setUser] = useState<FirebaseUser>(null);
	const [loading, setLoading] = useState(true);
	const [theme, setTheme] = useState<Theme | null>(null);

	useEffect(() => {
		const subscriber = fb.auth().onAuthStateChanged(onAuthStateChanged);
		getStoredTheme();
		return subscriber; // unsubscribe on unmount
	}, []);

	const getStoredTheme = async () => {
		try {
			const value = await AsyncStorage.getItem('theme');
			if (value !== null) {
				setTheme(getThemeFromString(value));
			} else {
				setTheme(getThemeFromString('theme1'));
			}
		} catch (e) {
			setTheme(getThemeFromString('theme1'));
		}
	};

	const changeTheme = (newThemeName: string) => {
		try {
			AsyncStorage.setItem('theme', newThemeName);
		} catch (e) {}
		setTheme(getThemeFromString(newThemeName));
	};

	const onAuthStateChanged = (user: FirebaseUser) => {
		if (loading) {
			setTimeout(() => {
				SplashScreen.hideAsync();
			}, 500);
			setLoading(false);
		}
		setUser(user);
	};

	if (theme === null) {
		return <></>;
	}

	return <AppContext.Provider value={{ user, theme, changeTheme }}>{children}</AppContext.Provider>;
};

export { AppProvider };
