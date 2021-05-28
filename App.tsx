import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppProvider } from './src/contexts/AppContext';
import { MainRouter } from './src/routers/MainRouter';

export default function App() {
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
