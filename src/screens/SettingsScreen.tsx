import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Button, Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../../firebase/functions/types/Chat';
import { fb, logOut } from '../api/firebase/login';
import { LoadingIndicator } from '../components/LoadingIndicator';
import AppContext from '../contexts/AppContext';
import { MapScreenNavigationProp } from '../types';
import { ChatDetail } from '../types/Chat';

const SettingsScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
	const { theme } = useContext(AppContext);
	const [logOutLoading, setLogOutLoading] = useState(false);

	const handleLogOutPress = async () => {
		setLogOutLoading(true);
		await logOut();
		setLogOutLoading(false);
	};

	const test = async () => {
		const message = {
			content: 'Aaaaaaaaa',
			id: 'vVbTZcj5LhZ3YtlXXKtr',
			name: 'The best chat ever',
			senderID: '9kSU5PGlKhbO7N9dQNKPyyoubCH3',
			senderName: 'test2@test.com',
			timestamp: 1624078813034
		};
		const doc = await fb.firestore().doc(`chats/${message.id}`).get();
		const { members } = doc.data() as ChatDetail;
		members
			.filter((member) => member.id !== message.senderID)
			.forEach((member) =>
				fb
					.firestore()
					.doc(`users/${member.id}`)
					.get()
					.then((userDoc) => {
						const { expoToken } = userDoc.data() as User;
						if (expoToken) {
							const data = {
								to: expoToken,
								sound: 'default',
								body: `${message.senderName}: ${message.content}`,
								title: message.name,
								data: {
									id: message.id,
									name: message.name
								}
							};
							return fetch('https://exp.host/--/api/v2/push/send', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(data)
							});
						} else {
							return new Promise(() => {});
						}
					})
			);
	};
	return (
		<View style={styles.buttonContainer}>
			<View style={{ ...styles.buttons, backgroundColor: theme.beerColor }}>
				<TouchableOpacity disabled={logOutLoading} onPress={test} style={styles.touchableButtons}>
					{logOutLoading ? <LoadingIndicator /> : <Text>test</Text>}
				</TouchableOpacity>
				{/* <TouchableOpacity disabled={logOutLoading} onPress={handleLogOutPress} style={styles.touchableButtons}>
					{logOutLoading ? <LoadingIndicator /> : <Text>Log Out</Text>}
				</TouchableOpacity> */}
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
	}
});

export { SettingsScreen };
