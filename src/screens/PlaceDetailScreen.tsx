import React, { FunctionComponent, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlaceDetailScreenNavigationProp } from '../types';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Input } from 'react-native-elements/dist/input/Input';

const PlaceDetailScreen: FunctionComponent<PlaceDetailScreenNavigationProp> = ({ route, navigation }) => {
	const placeInfo = route.params.placeInfo;

	useEffect(() => {
		navigation.setOptions({ headerTitle: placeInfo.name,
			headerRight: () => (
				<TouchableOpacity
					onPress={() =>
						navigation.navigate('BottomTabs')
					}
				>
					<MaterialIcons name="favorite-outline" size={24} color="white" style={{marginRight: 10}} />
				</TouchableOpacity>
			  )
		});
	}, []);

	var overallrating = 5
	var userrating = 1

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{JSON.stringify(placeInfo.name)}</Text>
			<Text style={styles.text}>Overall Rating: {overallrating}</Text>
			<Text style={styles.text}>User Rating: {userrating}</Text>
			<Input style={styles.rating} placeholder={'Enter a Rating'}></Input>
			<Button title= 'Submit'></Button>
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
	},
	text: {
		marginTop: 20,
		textAlign: 'center',
		fontSize: 35,
		fontWeight: 'bold'
	},
	rating: {
		
	}
});

export { PlaceDetailScreen };
