import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Button, Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppContext from '../contexts/AppContext';
import { MapScreenNavigationProp } from '../types';

const SettingsScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
	const { setUser } = useContext(AppContext);

	return (
		<View style={styles.container}>
			<Text>SettingsScreen</Text>
			<Button title={'Sign out'} onPress={() => setUser('')} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export { SettingsScreen };
