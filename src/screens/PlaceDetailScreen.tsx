import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-elements';
import { Input } from 'react-native-elements/dist/input/Input';
import { MaterialIcons } from '@expo/vector-icons';
import { addOverallRating, addUserRating, getOverallRating, getUserRating } from '../api/firebase/detail';
import { deleteFavourite, saveFavourite } from '../api/firebase/favorites';
import { LoadingIndicator } from '../components/LoadingIndicator';
import AppContext from '../contexts/AppContext';
import { PlaceDetailScreenNavigationProp } from '../types';

const PlaceDetailScreen: FunctionComponent<PlaceDetailScreenNavigationProp> = ({ route, navigation }) => {
	const placeInfo = route.params.placeInfo;
	const isFavouritedParam = route.params.isFavourited;
	const showMap = route.params.showMap;

	const { user, theme } = useContext(AppContext);
	const [submitLoading, setSubmit] = useState(false);
	const [rating, setRating] = useState('');
	const [userRating, setUserRating] = useState(0);
	const [overallRating, setOverallRating] = useState(0);
	const [favouriteLoading, setFavouriteLoading] = useState(false);
	const [isFavourite, setIsFavourite] = useState(isFavouritedParam ?? false);

	const handleSubmit = async () => {
		var ratingNum: number = +rating;
		if (ratingNum < 1 || ratingNum > 5 || isNaN(ratingNum) || rating == '') {
			setSubmit(false);
		} else {
			setSubmit(true);
			var myRating: number = +rating;
			await addUserRating(user?.uid!, myRating, placeInfo.name);
			await addOverallRating(user?.uid!, myRating, placeInfo.name);
			setSubmit(false);
		}
	};

	function checkRating(rating: string) {
		var ratingNum: number = +rating;
		if ((ratingNum < 1 || ratingNum > 5 || isNaN(ratingNum)) && rating != '') {
			return 'Oops, enter a number 1-5 (e.g. 1.2 or 3)';
		}
	}

	useEffect(() => {
		async function uRating() {
			const userrating: any = await getUserRating(user?.uid!, placeInfo.name);
			const myRate: number = Number(userrating.userRating);
			setUserRating(myRate);
		}

		async function oRating() {
			const overallrating: any = await getOverallRating(placeInfo.name);
			const myOverallRate: number = Number(overallrating.rating);
			setOverallRating(myOverallRate);
		}

		uRating();
		oRating();
		navigation.setOptions({
			headerTitle: placeInfo.name
		});
	}, []);

	useEffect(() => {
		navigation.setOptions({
			headerTitle: placeInfo.name,
			headerRight: () => (
				<TouchableOpacity
					disabled={favouriteLoading}
					onPress={async () => {
						setFavouriteLoading(true);
						if (isFavourite) {
							deleteFavourite(user?.uid!, placeInfo.id)
								.then(() => {
									setIsFavourite(false);
								})
								.catch(() => {})
								.finally(() => setFavouriteLoading(false));
						} else {
							saveFavourite(user?.uid!, placeInfo)
								.then(() => {
									setIsFavourite(true);
								})
								.catch(() => {})
								.finally(() => setFavouriteLoading(false));
						}
					}}
				>
					{isFavourite ? (
						<MaterialIcons name='favorite' size={24} color='white' style={{ marginRight: 10 }} />
					) : (
						<MaterialIcons name='favorite-outline' size={24} color='white' style={{ marginRight: 10 }} />
					)}
				</TouchableOpacity>
			)
		});
	}, [favouriteLoading, isFavourite]);

	return (
		<View style={{ ...styles.container, backgroundColor: theme.background }}>
			<Card containerStyle={{ backgroundColor: '#FFF7D5' }}>
				<Text style={styles.title}>{placeInfo.name}</Text>
				<Card.Divider />
				<Text style={styles.text}>Overall Rating: {overallRating}</Text>
				<Text style={styles.text2}>User Rating: {userRating}</Text>
				<Card.Divider />
				<Input
					inputContainerStyle={{ borderBottomWidth: 0, width: 350 }}
					style={{
						...styles.textInput,
						backgroundColor: theme.elevation1
					}}
					placeholder={'Enter a Rating'}
					onChangeText={setRating}
					value={rating}
					errorStyle={{ color: 'red' }}
					errorMessage={checkRating(rating)}
				></Input>
			</Card>
			<View style={styles.buttonContainer}>
				<View style={{ ...styles.buttons, backgroundColor: theme.beerColor }}>
					<TouchableOpacity disabled={submitLoading} onPress={handleSubmit} style={styles.touchableButtons}>
						{submitLoading ? <LoadingIndicator /> : <Text style={{ color: 'white' }}>Submit</Text>}
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
		fontSize: 30,
		fontWeight: 'bold',
		marginBottom: 20
	},
	text2: {
		marginTop: 20,
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		marginBottom: 40
	},
	title: {
		marginTop: 20,
		textAlign: 'center',
		fontSize: 36,
		fontWeight: 'bold',
		fontStyle: 'italic',
		marginBottom: 50
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
		shadowRadius: 3.84
	},
	buttonContainer: {
		width: '86%',
		flexDirection: 'row',
		marginTop: 30
	},
	touchableButtons: {
		width: 300,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	textInput: {
		marginTop: 40,
		marginBottom: 40,
		alignContent: 'center',
		textAlign: 'center',
		width: '86%',
		height: 55,
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginVertical: 10,
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5
	}
});

export { PlaceDetailScreen };
