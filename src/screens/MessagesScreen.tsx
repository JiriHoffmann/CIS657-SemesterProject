import React, { FunctionComponent, useLayoutEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MessagesScreenNavigationProp } from '../types';

const MessagesScreen: FunctionComponent<MessagesScreenNavigationProp> = ({ route, navigation }) => {
	return (
		<View style={styles.container}>
			<Text>Messages</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export { MessagesScreen };
