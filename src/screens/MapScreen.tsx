import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchBeerLocations } from '../api/beermapping/API';
import { getOverallRating } from '../api/firebase/detail';
import { LocationSearchButton } from '../components/LocationSearchButton';
import { MapZoomInIndicator } from '../components/MapZoomInIndicator';
import AppContext from '../contexts/AppContext';
import { MapScreenNavigationProp } from '../types';
import { BeerLocation, UserLocation } from '../types/BeerMapping';

const INITIAL_REGION = {
	latitude: 42.96058506728029,
	latitudeDelta: 0.2756527083497531,
	longitude: -85.67288858816028,
	longitudeDelta: 0.18000002950431337
};

const MapScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
	const mapRef = useRef<MapView>(null);
	const { theme } = useContext(AppContext);

	const [isZoomedIn, setIsZoomedIn] = useState(false);
	const [mapRegion, setMapRegion] = useState<Region>(INITIAL_REGION);
	const [beerLocations, setBeerLocations] = useState<BeerLocation[]>([]);
	const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
	const [overallRate, setOverallRating] = useState(0);

	useEffect(() => {
		if (userLocation) {
			animateToLocation(userLocation.latitude, userLocation.longitude);
		}
	}, [userLocation]);

	const getNewBeerLocations = async (lat: any, long: any) => {
		const newLocations = await fetchBeerLocations(lat, long).catch(() => {});
		setBeerLocations(newLocations);
	};

	const onRegionChange = (region: Region) => {
		setMapRegion(region);
	};

	const onRegionChangeComplete = (region: Region) => {
		// only fetch new locations when zoomed in
		if (region.latitudeDelta < 0.4 && region.longitudeDelta < 0.4) {
			setIsZoomedIn(true);
			getNewBeerLocations(region.latitude, region.longitude);
		} else {
			setIsZoomedIn(false);
		}
	};

	const handleMarkerPress = async (location: BeerLocation) => {
		const overallrating: any = await getOverallRating(location.name);
		const myOverallRate: number = Number(overallrating.rating);
		setOverallRating(myOverallRate);

		animateToLocation(location.lat, location.lon);
	};

	const handleCalloutPress = (location: BeerLocation) => {
		navigation.navigate('PlaceDetail', { placeInfo: location });
	};

	const animateToLocation = (latitude: number, longitude: number) => {
		if (mapRef && mapRef.current) {
			let region = {
				longitude: longitude,
				latitude: latitude,
				longitudeDelta: 0.18,
				latitudeDelta: 0.18
			};
			mapRef.current.animateToRegion(region, 500);
		}
	};

	return (
		<View style={styles.container}>
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={INITIAL_REGION}
				onRegionChangeComplete={onRegionChangeComplete}
				onRegionChange={onRegionChange}
				loadingEnabled={true}
			>
				{/* LOCATION MARKERS */}
				{beerLocations.map((loc) => (
					<Marker
						key={loc.id}
						coordinate={{ latitude: loc.lat, longitude: loc.lon }}
						title={loc.name}
						description={'Rating: ' + overallRate}
						onPress={() => handleMarkerPress(loc)}
						onCalloutPress={() => handleCalloutPress(loc)}
					/>
				))}

				{/* USER LOCATION MARKER */}
				{userLocation && (
					<Marker coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}>
						<MaterialIcons name={'person-pin-circle'} size={40} color={theme.beerColor} />
					</Marker>
				)}
			</MapView>
			<MapZoomInIndicator
				show={!isZoomedIn}
				style={{ ...styles.zoomInIndicator, backgroundColor: theme.elevation3 }}
			/>
			<LocationSearchButton
				style={{ ...styles.locationSearchButton, backgroundColor: theme.elevation2 }}
				locationCallback={setUserLocation}
			/>
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
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height
	},
	zoomInIndicator: {
		position: 'absolute',
		top: 20,
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		paddingHorizontal: 15,
		paddingVertical: 5,
		borderRadius: 20
	},
	locationSearchButton: {
		position: 'absolute',
		bottom: 20,
		right: 10,
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

export { MapScreen };
