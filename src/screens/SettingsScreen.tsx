import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Button, Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logOut } from '../api/firebase/login';
import AppContext from '../contexts/AppContext';
import { MapScreenNavigationProp } from '../types';
import { LoadingIndicator } from'../components/LoadingIndicator';

const SettingsScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
const { theme } = useContext(AppContext);
const [logOutLoading, setLogOutLoading] = useState(false);

const handleLogOutPress = async () => {
	setLogOutLoading(true);
	await logOut();
	setLogOutLoading(false);
};
	return (
		<View style={styles.buttonContainer}>



			<View style={{ ...styles.buttons, backgroundColor: theme.beerColor }}>
				<TouchableOpacity
					disabled={logOutLoading}
					onPress={handleLogOutPress}
					style={styles.touchableButtons}
				>
					{logOutLoading ? <LoadingIndicator /> : <Text>Log Out</Text>}
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
		width: '78%',
		flexDirection: 'row',
		marginBottom: 20,
		marginLeft: 50
	},
	buttons: {
		flex: 1,
		marginHorizontal: 10,
		height: 40,
		borderRadius: 20,
		justifyContent: 'flex-end',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5
	},
	touchableButtons: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
});

export { SettingsScreen };
