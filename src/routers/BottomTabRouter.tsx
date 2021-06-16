import React, { FunctionComponent } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FavouritesScreen, MapScreen, SettingsScreen } from '../screens';
import { MessagesScreen } from '../screens/MessagesScreen';
import { BottomTabParamList } from '../types';

const ACTIVE_COLOR = '#B5490E';
const INACTIVE_COLOR = 'gray';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabRouter: FunctionComponent = () => {
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
					} else if (route.name === 'Messages') {
						iconName = 'message';
					}

					return (
						// @ts-ignore
						<MaterialIcons name={iconName} size={30} color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
					);
				}
			})}
			tabBarOptions={{
				activeTintColor: ACTIVE_COLOR,
				inactiveTintColor: INACTIVE_COLOR
			}}
		>
			<Tab.Screen name='Map' component={MapScreen} />
			<Tab.Screen name='Favourites' component={FavouritesScreen} />
			<Tab.Screen name='Messages' component={MessagesScreen} />
			<Tab.Screen name='Settings' component={SettingsScreen} />
		</Tab.Navigator>
	);
};

export { BottomTabRouter };
