import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { BeerLocation } from './BeerMapping';

// Main Router
export type RootStackParamList = {
	Login: undefined;
	BottomTabs: undefined;
	PlaceDetail: { placeInfo: BeerLocation };
};

export type LoginScreenNavigationProp = StackScreenProps<RootStackParamList, 'Login'>;
export type PlaceDetailScreenNavigationProp = StackScreenProps<RootStackParamList, 'PlaceDetail'>;

// BottomTabRouter
export type BottomTabParamList = {
	Map: undefined;
	Favourites: undefined;
	Messages: undefined;
	Settings: undefined;
};

// Map Screen
export type MapScreenNavigationProp = {
	route: RouteProp<BottomTabParamList, 'Map'>;
	navigation: CompositeNavigationProp<
		StackNavigationProp<RootStackParamList, 'BottomTabs'>,
		BottomTabNavigationProp<BottomTabParamList, 'Map'>
	>;
};

// Favourites
export type FavouritesScreenNavigationProp = {
	route: RouteProp<BottomTabParamList, 'Favourites'>;
	navigation: CompositeNavigationProp<
		StackNavigationProp<RootStackParamList, 'BottomTabs'>,
		BottomTabNavigationProp<BottomTabParamList, 'Favourites'>
	>;
};

export type MessagesScreenNavigationProp = BottomTabScreenProps<BottomTabParamList, 'Messages'>;
export type SettingsScreenNavigationProp = BottomTabScreenProps<BottomTabParamList, 'Settings'>;
