import React, { FunctionComponent, useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteAccount, fb, logOut } from '../api/firebase/login';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ThemePicker } from '../components/ThemePicker';
import AppContext from '../contexts/AppContext';
import { MapScreenNavigationProp } from '../types';

const SettingsScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
	const { theme } = useContext(AppContext);
	const [logOutLoading, setLogOutLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const handleLogOutPress = async () => {
		setLogOutLoading(true);
		await logOut().catch(() => setLogOutLoading(false));
	};

	const handleDeleteAccountPress = async () => {
		Alert.alert('Woah!', 'Are you sure you want to delete your account?', [
			{
				text: 'Cancel',
				style: 'cancel'
			},
			{
				text: 'OK',
				onPress: async () => {
					deleteAccount().catch(() => {
						setDeleteLoading(true);
					});
				}
			}
		]);
	};

	return (
		<View style={styles.container}>
			<ThemePicker />

			<View style={styles.deleteAndLogOutButtonsContainer}>
				<TouchableOpacity
					disabled={deleteLoading}
					onPress={handleDeleteAccountPress}
					style={{ ...styles.deleteAndLogOutButtons, backgroundColor: 'red' }}
				>
					{logOutLoading ? <LoadingIndicator /> : <Text style={styles.buttonText}>Delete Account</Text>}
				</TouchableOpacity>
				<TouchableOpacity
					disabled={logOutLoading}
					onPress={handleLogOutPress}
					style={{ ...styles.deleteAndLogOutButtons, backgroundColor: theme.beerColor }}
				>
					{logOutLoading ? <LoadingIndicator /> : <Text style={styles.buttonText}>Log Out</Text>}
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		paddingTop: 30
	},
	deleteAndLogOutButtons: {
		marginHorizontal: '7%',
		marginVertical: 5,
		height: 50,
		width: '84%',
		borderRadius: 20,
		justifyContent: 'center',
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
	deleteAndLogOutButtonsContainer: {
		position: 'absolute',
		bottom: 20,
		width: '100%'
	},
	buttonText: { color: 'white', fontWeight: 'bold', fontSize: 17 }
});

export { SettingsScreen };
