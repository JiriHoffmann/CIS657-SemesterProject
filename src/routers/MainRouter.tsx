import React, { FunctionComponent, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppContext from '../contexts/AppContext';
import { ChatDetailScreen, LoginScreen, PlaceDetailScreen, FavouritesScreen } from '../screens';
import { RootStackParamList } from '../types';
import { BottomTabRouter } from './BottomTabRouter';

const Stack = createStackNavigator<RootStackParamList>();

const MainRouter: FunctionComponent = () => {
	const { user, theme } = useContext(AppContext);

	return (
		<NavigationContainer>
			<Stack.Navigator
				mode='modal'
				screenOptions={{
					headerStyle: {
						backgroundColor: theme.beerColor
					},
					headerTintColor: '#fff'
				}}
			>
				{user === null ? (
					<Stack.Screen
						name='Login'
						component={LoginScreen}
						options={{
							title: 'Beer Me'
						}}
					/>
				) : (
					<>
						<Stack.Screen name='BottomTabs' options={{ title: 'Beer Me' }} component={BottomTabRouter} />
						<Stack.Screen name='PlaceDetail' component={PlaceDetailScreen} />
						<Stack.Screen name='Favourites' component={FavouritesScreen} />
						<Stack.Screen name='ChatDetail' component={ChatDetailScreen} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export { MainRouter };
