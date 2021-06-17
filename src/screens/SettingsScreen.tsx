import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Button, Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { logOut } from '../api/firebase/login';
import AppContext from '../contexts/AppContext';
import { MapScreenNavigationProp } from '../types';

const SettingsScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
	return (
		<View style={styles.container}>
			<Text>SettingsScreen</Text>
			<Button
				title={'Sign out'}
				onPress={() => {
					logOut();
				}}
			/>
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
