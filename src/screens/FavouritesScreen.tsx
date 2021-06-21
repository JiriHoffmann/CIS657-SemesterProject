import { useBackButton } from '@react-navigation/native';
import React, { FunctionComponent, useState } from 'react';
import { useEffect } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { FlatList} from 'react-native-gesture-handler';
import { FavouritesScreenNavigationProp } from '../types';
import { writeData, setUpListener } from '../api/firebase/favorites';

const FavouritesScreen: FunctionComponent<FavouritesScreenNavigationProp> = ({ route, navigation }) => {
	const breweryName = route.params.placeName
	
	const [brewery, setBrewery] = useState([]);


	useEffect(() => {
		setUpListener((items: any) => {
			setBrewery(items)
		});
	}, []);

	return (
		<View style={styles.container}>
			<FlatList
				keyExtractor={(item) => item.id}
				data={brewery}
				renderItem={({item}) => {
					return(
						<Text style={{marginBottom:50, marginTop: 20, color: 'black', fontSize: 30, fontWeight: 'bold'}}> {item} </Text>
					);
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
	},
	OpacityStyle:{
		alignItems:'center',
		width: 350,
		height: 75,
		marginTop:20,
		marginBottom:10,
		marginRight:15,
		padding:5,
	  },
});

export { FavouritesScreen };
