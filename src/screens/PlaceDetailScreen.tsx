import React, { FunctionComponent, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PlaceDetailScreenNavigationProp } from '../types';

const PlaceDetailScreen: FunctionComponent<PlaceDetailScreenNavigationProp> = ({ route, navigation }) => {
	const placeInfo = route.params.placeInfo;

	useEffect(() => {
		navigation.setOptions({ headerTitle: placeInfo.name });
	}, []);

	return (
		<View style={styles.container}>
			<Text>{JSON.stringify(placeInfo)}</Text>
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

export { PlaceDetailScreen };
