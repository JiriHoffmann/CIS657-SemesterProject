import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';

// Main Router
export type RootStackParamList = {
	Login: undefined;
	BottomTabs: undefined;
};

export type LoginScreenNavigationProp = StackScreenProps<RootStackParamList, 'Login'>;

// BottomTabRouter
export type BottomTabParamList = {
	Map: undefined;
	Favourites: undefined;
	Settings: undefined;
};

export type MapScreenNavigationProp = BottomTabScreenProps<BottomTabParamList, 'Map'>;
export type FavouritesScreenNavigationProp = BottomTabScreenProps<BottomTabParamList, 'Favourites'>;
export type SettingsScreenNavigationProp = BottomTabScreenProps<BottomTabParamList, 'Settings'>;
