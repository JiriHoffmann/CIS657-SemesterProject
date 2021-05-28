import React, { FunctionComponent, useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapScreenNavigationProp } from '../types';

const MapScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
	return (
		<View style={styles.container}>
			<Text>Map Screen</Text>
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

export { MapScreen };
