import React, { FunctionComponent, useContext, useState } from 'react';
import { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { Tile } from 'react-native-elements/dist/tile/Tile';
import { subscribeToFavouritesForUser } from '../api/firebase/favorites';
import { LoadingIndicator } from '../components/LoadingIndicator';
import AppContext from '../contexts/AppContext';
import { FavouritesScreenNavigationProp } from '../types';
import { BeerLocation } from '../types/BeerMapping';

const FavouritesScreen: FunctionComponent<FavouritesScreenNavigationProp> = ({ navigation }) => {
	const { user, theme } = useContext(AppContext);

	const [brewery, setBrewery] = useState<BeerLocation[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = subscribeToFavouritesForUser(user?.uid ?? null, (data) => {
			if (loading) setLoading(false);
			setBrewery(data);
		});

		return unsubscribe;
	}, [user?.uid]);

	const handleFavouritePress = (place: BeerLocation) => {
		navigation.navigate('PlaceDetail', { placeInfo: place, isFavourited: true, showMap: true });
	};

	return (
		<View style={styles.container}>
			{loading && <LoadingIndicator />}

			<FlatList
				keyExtractor={(item) => item.id}
				data={brewery}
				renderItem={({ item }) => {
					return (
						<Pressable onPress={() => handleFavouritePress(item)}>
							<Divider>
								<Text
									style={{
										marginBottom: 10,
										marginTop: 20,
										color: 'black',
										fontSize: 30,
										fontWeight: 'bold'
									}}
								>
									{item.name}
								</Text>
								<Text
									style={{
										textAlign: 'right',
										marginRight: 10,
										fontStyle: 'italic',
										color: 'grey',
										fontSize: 12
									}}
								>
									{item.street}
								</Text>
							</Divider>
						</Pressable>
					);
				}}
			/>
			{!loading && brewery.length === 0 && (
				<Text style={styles.noMessageText}>
					Looks like you have no favourites. You can send a new one by opening a brewery and usinng the ♡
					button
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	noMessageText: {
		position: 'absolute',
		top: 100,
		width: '100%',
		paddingHorizontal: '8%',
		textAlign: 'center',
		fontSize: 20,
		color: 'gray'
	}
});

export { FavouritesScreen };
