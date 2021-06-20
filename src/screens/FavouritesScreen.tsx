import React, { FunctionComponent } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { FavouritesScreenNavigationProp } from '../types';

const FavouritesScreen: FunctionComponent<FavouritesScreenNavigationProp> = ({ route, navigation }) => {

	const breweryName = route.params.placeName


	return (
		<View style={styles.container}>
			<Text>{breweryName}</Text>
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

export { FavouritesScreen };
