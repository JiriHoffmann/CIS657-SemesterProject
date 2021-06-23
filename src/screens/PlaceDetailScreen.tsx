import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Rating } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchBeerLocationImage } from '../api/beermapping/API';
import { addUserRating, getOverallRating, getUserRating } from '../api/firebase/detail';
import { deleteFavourite, saveFavourite } from '../api/firebase/favorites';
import { LoadingIndicator } from '../components/LoadingIndicator';
import AppContext from '../contexts/AppContext';
import { PlaceDetailScreenNavigationProp } from '../types';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const PlaceDetailScreen: FunctionComponent<PlaceDetailScreenNavigationProp> = ({ route, navigation }) => {
	const placeInfo = route.params.placeInfo;
	const isFavouritedParam = route.params.isFavourited;
	const showMap = route.params.showMap;

	const { user, theme } = useContext(AppContext);
	const [submittingRating, setSubmittingRating] = useState(false);
	const [rating, setRating] = useState(3);
	const [overallRating, setOverallRating] = useState(0);
	const [favouriteLoading, setFavouriteLoading] = useState(false);
	const [isFavourite, setIsFavourite] = useState(isFavouritedParam ?? false);
	const [fetchingImage, setFetchingImage] = useState(true);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const handleSubmit = async () => {
		setSubmittingRating(true);
		await addUserRating(user?.uid!, rating, placeInfo.id);
		await getOverallRating(placeInfo.id)
			.then((res) => res && setOverallRating(res))
			.catch(() => {});
		setSubmittingRating(false);
	};

	useEffect(() => {
		getUserRating(user?.uid!, placeInfo.name)
			.then((res) => res && setRating(res))
			.catch(() => {});
		getOverallRating(placeInfo.id)
			.then((res) => res && setOverallRating(res))
			.catch(() => {});

		fetchBeerLocationImage(placeInfo.id)
			.then((res) => {
				setImageUrl(res);
			})
			.catch(() => {})
			.finally(() => {
				setFetchingImage(false);
			});

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
		<View style={{ ...styles.container }}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ width: '100%', height: '100%' }}
				contentContainerStyle={{ alignItems: 'center' }}
			>
				<View style={styles.imageContainer}>
					{fetchingImage && <LoadingIndicator />}
					{!fetchingImage && imageUrl !== null && <Image style={styles.image} source={{ uri: imageUrl }} />}
					{!fetchingImage && imageUrl === null && <Text>No Image found :/</Text>}
				</View>
				<Text style={styles.title}>{placeInfo.name}</Text>
				<Text style={styles.text3}>
					Address: {placeInfo.street}, {placeInfo.city}
				</Text>
				<Text style={styles.text3}>Phone Number: {placeInfo.phone}</Text>
				<Text style={styles.text3}>Google Ratings: {placeInfo.gtotal}</Text>
				<Text style={styles.text4} onPress={() => Linking.openURL('http://google.com')}>
					Website: <Text style={{ color: 'blue' }}>{placeInfo.url}</Text>
				</Text>

				<Text style={styles.text}>Our Rating: {overallRating}</Text>

				<Rating showRating value={rating} onFinishRating={setRating}></Rating>
				<View style={styles.buttonContainer}>
					<View style={{ ...styles.buttons, backgroundColor: theme.beerColor }}>
						<TouchableOpacity
							disabled={submittingRating}
							onPress={handleSubmit}
							style={styles.touchableButtons}
						>
							{submittingRating ? <LoadingIndicator /> : <Text style={{ color: 'white' }}>Submit</Text>}
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},

	imageContainer: {
		width: SCREEN_WIDTH,
		height: SCREEN_WIDTH,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: SCREEN_WIDTH,
		height: SCREEN_WIDTH
	},
	text: {
		marginTop: 10,
		textAlign: 'center',
		fontSize: 25,
		fontWeight: 'bold',
		marginBottom: 20
	},
	text2: {
		marginTop: 20,
		textAlign: 'center',
		fontSize: 25,
		fontWeight: 'bold',
		marginBottom: 30
	},
	text3: {
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	text4: {
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20
	},
	title: {
		marginTop: 10,
		textAlign: 'center',
		fontSize: 30,
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
		marginBottom: 50,
		height: 50,
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
		width: '100%',
		flexDirection: 'row',
		marginTop: 30,
		alignItems: 'center',
		justifyContent: 'center'
	},
	touchableButtons: {
		width: 300,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	textInput: {
		marginTop: 20,
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
