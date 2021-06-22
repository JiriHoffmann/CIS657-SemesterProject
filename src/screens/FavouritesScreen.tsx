import { useBackButton } from '@react-navigation/native';
import React, { FunctionComponent, useState } from 'react';
import { useEffect } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { FlatList} from 'react-native-gesture-handler';
import { FavouritesScreenNavigationProp } from '../types';
import { writeData, setUpListener } from '../api/firebase/favorites';

const FavouritesScreen: FunctionComponent<FavouritesScreenNavigationProp> = ({ route, navigation }) => {
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
						<View>
						<Text style={{marginBottom:10, marginTop: 20, color: 'black', fontSize: 30, fontWeight: 'bold'}}> {item[0]}</Text>
						<Text style={{textAlign: "right", marginRight: 10, fontStyle: "italic", color: "grey", fontSize: 12}}> {item[1]}</Text>
						</View>
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
