import React, { FunctionComponent, useContext } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppContext from '../contexts/AppContext';
import { FavouritesScreen, MapScreen, SettingsScreen } from '../screens';
import { ChatScreen } from '../screens/ChatScreen';
import { BottomTabParamList } from '../types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabRouter: FunctionComponent = () => {
	const { theme } = useContext(AppContext);

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused }) => {
					let iconName = '';
					if (route.name === 'Map') {
						iconName = 'map';
					} else if (route.name === 'Favourites') {
						iconName = focused ? 'favorite' : 'favorite-outline';
					} else if (route.name === 'Settings') {
						iconName = 'settings';
					} else if (route.name === 'Chat') {
						iconName = 'message';
					}

					return (
						// @ts-ignore
						<MaterialIcons name={iconName} size={30} color={focused ? theme.beerColor : 'gray'} />
					);
				}
			})}
			tabBarOptions={{
				activeTintColor: theme.beerColor,
				inactiveTintColor: 'gray'
			}}
		>
			<Tab.Screen name='Map' component={MapScreen} />
			<Tab.Screen name='Favourites' component={FavouritesScreen} />
			<Tab.Screen name='Chat' component={ChatScreen} />
			<Tab.Screen name='Settings' component={SettingsScreen} />
		</Tab.Navigator>
	);
};

export { BottomTabRouter };
