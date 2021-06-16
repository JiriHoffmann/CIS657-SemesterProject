import React, { FunctionComponent, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppContext from '../contexts/AppContext';
import { LoginScreen, PlaceDetailScreen } from '../screens';
import { RootStackParamList } from '../types';
import { BottomTabRouter } from './BottomTabRouter';

const Stack = createStackNavigator<RootStackParamList>();

const MainRouter: FunctionComponent = () => {
	const { user } = useContext(AppContext);

	return (
		<NavigationContainer>
			<Stack.Navigator
				mode='modal'
				screenOptions={{
					headerStyle: {
						backgroundColor: '#fca605'
					},
					headerTintColor: '#fff'
				}}
			>
				{user === null ? (
					<Stack.Screen
						name='Login'
						component={LoginScreen}
						options={{
							title: 'Beer Me',
							cardStyle: { backgroundColor: '#3d3' }
						}}
					/>
				) : (
					<>
						<Stack.Screen name='BottomTabs' options={{ title: 'Beer Me' }} component={BottomTabRouter} />
						<Stack.Screen name='PlaceDetail' component={PlaceDetailScreen} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export { MainRouter };
