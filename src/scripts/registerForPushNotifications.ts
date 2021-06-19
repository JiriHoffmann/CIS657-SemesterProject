import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

export const registerForPushNotificationsAsync = async (): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		if (Constants.isDevice) {
			const { status: existingStatus } = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== 'granted') {
				reject('Failed to get push token for push notification!');
				return;
			}
			const token = (await Notifications.getExpoPushTokenAsync()).data;
			if (token) {
				resolve(token);
			} else {
				reject('Failed to get push token for push notification!');
			}
		} else {
			Alert.alert('Oooops', 'Must use physical device for Push Notifications');
			reject('Must use physical device for Push Notifications');
		}

		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#fca605'
			});
		}
	});
};
