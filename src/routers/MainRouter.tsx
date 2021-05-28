import React, { FunctionComponent, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppContext from '../contexts/AppContext';
import { LoginScreen } from '../screens';
import { RootStackParamList } from '../types';
import { BottomTabRouter } from './BottomTabRouter';

const Stack = createStackNavigator<RootStackParamList>();

const MainRouter: FunctionComponent = () => {
	const { user } = useContext(AppContext);

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerStyle: {
						backgroundColor: '#2565A4'
					},
					headerTintColor: '#fff'
				}}
			>
				{user === '' ? (
					<Stack.Screen
						name='Login'
						component={LoginScreen}
						options={{
							title: 'Beer Me'
						}}
					/>
				) : (
					<Stack.Screen name='BottomTabs' component={BottomTabRouter} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export { MainRouter };
