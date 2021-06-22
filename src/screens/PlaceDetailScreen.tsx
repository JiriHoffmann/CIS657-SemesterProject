import React, { FunctionComponent, useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { PlaceDetailScreenNavigationProp } from '../types';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Input } from 'react-native-elements/dist/input/Input';
import AppContext from '../contexts/AppContext';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { addOverallRating, addUserRating, getUserRating } from '../api/firebase/detail';
import { setUpListener, writeData } from '../api/firebase/favorites';
import { TabRouter } from '@react-navigation/native';

const PlaceDetailScreen: FunctionComponent<PlaceDetailScreenNavigationProp> = ({ route, navigation }) => {
	const { user, theme } = useContext(AppContext);
	const [submitLoading, setSubmit] = useState(false)
	const [rating, setRating] = useState('');
	const placeInfo = route.params.placeInfo;
	var overallrating = 5
	var userrating: any | undefined

	const handleSubmit = async () =>{
		var ratingNum: number = +rating
		if((ratingNum < 1 || ratingNum > 5 || isNaN(ratingNum)) || rating == ''){
			setSubmit(false);
		}
		else{
			setSubmit(true);
			var myRating: number = +rating
			await addUserRating(user?.uid ?? null, myRating, placeInfo.name)
			await addOverallRating(user?.uid ?? null, myRating, placeInfo.name)
			setSubmit(false);
			navigation.navigate('BottomTabs')
		}
	};

	function checkRating (rating: string){
		var ratingNum: number = +rating
		if((ratingNum < 1 || ratingNum > 5 || isNaN(ratingNum)) && rating != ''){
			return 'Oops, enter a number 1-5 (e.g. 1.2 or 3)'
		}
	}

	useEffect(() => {
		userrating = getUserRating(user?.uid ?? null, placeInfo.name)
		console.log(userrating)

		navigation.setOptions({ headerTitle: placeInfo.name,
			headerRight: () => (
				<TouchableOpacity
					onPress={() =>{						
						writeData(placeInfo.name)
						navigation.navigate('Favourites', {placeName: placeInfo.name})
						}
					}
				>
					<MaterialIcons name="favorite-outline" size={24} color="white" style={{marginRight: 10}} />
				</TouchableOpacity>
			  )
		});
	}, []);

	
	return (
		<View style={{ ...styles.container, backgroundColor: theme.background }}>
			<Text style={styles.text}>{JSON.stringify(placeInfo.name)}</Text>
			<Text style={styles.text}>Overall Rating: {overallrating}</Text>
			<Text style={styles.text}>User Rating: {userrating}</Text>
			<Input style={styles.rating} placeholder={'Enter a Rating'}
			onChangeText={setRating}
			value={rating}
			errorStyle={{ color: 'red' }}
  			errorMessage={checkRating(rating)}
			></Input>
			<View style={styles.buttonContainer}>
				<View style={{ ...styles.buttons, backgroundColor: theme.beerColor }}>
					<TouchableOpacity
						disabled={submitLoading}
						onPress={handleSubmit}
						style={styles.touchableButtons}
					>
						{submitLoading ? <LoadingIndicator /> : <Text style={{color: 'white'}}>Submit</Text>}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	text: {
		marginTop: 20,
		textAlign: 'center',
		fontSize: 35,
		fontWeight: 'bold'

	},
	rating: {
		marginTop: 25,
		textAlign: 'center'
	},
	buttons: {
		flex: 1,
		marginHorizontal: 10,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	buttonContainer: {
		width: '86%',
		flexDirection: 'row',
		marginTop: 20
	},
	touchableButtons: {
		width: 300,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
});

export { PlaceDetailScreen };
