import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppProvider } from './src/contexts/AppContext';
import { MainRouter } from './src/routers/MainRouter';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true
	})
});

export default function App() {
	useEffect(() => {
		async function prepare() {
			try {
				// Keep the splash screen visible while we fetch resources
				await SplashScreen.preventAutoHideAsync();
			} catch (e) {
				console.warn(e);
			}
		}

		Notifications.addNotificationReceivedListener(handleNotification);

		Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

		prepare();
	}, []);

	const handleNotification = (event: Notifications.Notification) => {
		console.log('HN', event.request);
	};

	const handleNotificationResponse = (event: Notifications.NotificationResponse) => {
		console.log(event.notification);
	};

	return (
		<View style={styles.container}>
			<AppProvider>
				<MainRouter />
			</AppProvider>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
