import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { BeerLocation } from './BeerMapping';
import { ChatMember } from './Chat';

// Main Router
export type RootStackParamList = {
	Login: undefined;
	BottomTabs: undefined;
	Favourites: {placeName: string}
	PlaceDetail: { placeInfo: BeerLocation };
	ChatDetail: { newChatUsers?: ChatMember[]; chatName?: string; chatID?: string };
};

export type LoginScreenNavigationProp = StackScreenProps<RootStackParamList, 'Login'>;
export type PlaceDetailScreenNavigationProp = StackScreenProps<RootStackParamList, 'PlaceDetail'>;
export type ChatDetailScreenNavigationProp = StackScreenProps<RootStackParamList, 'ChatDetail'>;

// BottomTabRouter
export type BottomTabParamList = {
	Map: undefined;
	Favourites: {placeName: BeerLocation};
	Chat: undefined;
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

// Chat
export type ChatScreenNavigationProp = {
	route: RouteProp<BottomTabParamList, 'Chat'>;
	navigation: CompositeNavigationProp<
		StackNavigationProp<RootStackParamList, 'BottomTabs'>,
		BottomTabNavigationProp<BottomTabParamList, 'Chat'>
	>;
};

export type SettingsScreenNavigationProp = BottomTabScreenProps<BottomTabParamList, 'Settings'>;
