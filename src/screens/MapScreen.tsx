import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchBeerLocations } from '../api/beermapping/API';
import { LocationSearchButton } from '../components/LocationSearchButton';
import { MapZoomInIndicator } from '../components/MapZoomInIndicator';
import AppContext from '../contexts/AppContext';
import { MapScreenNavigationProp } from '../types';
import { BeerLocation, UserLocation } from '../types/BeerMapping';

const INITIAL_REGION = {
	latitude: 42.460584030103824,
	longitude: -86.22584420479463,
	latitudeDelta: 3,
	longitudeDelta: 3
};

const MapScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
	const mapRef = useRef<MapView>(null);
	const { theme } = useContext(AppContext);

	const [isZoomedIn, setIsZoomedIn] = useState(false);
	const [mapRegion, setMapRegion] = useState<Region>(INITIAL_REGION);
	const [beerLocations, setBeerLocations] = useState<BeerLocation[]>([]);
	const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

	useEffect(() => {
		if (userLocation) {
			getNewBeerLocations(mapRegion.latitude, mapRegion.longitude);
			animateToLocation(userLocation.latitude, userLocation.longitude);
		}
	}, [userLocation]);

	const getNewBeerLocations = async (lat: any, long: any) => {
		const newLocations = await fetchBeerLocations(lat, long);
		console.log(newLocations);
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

	const handleMarkerPress = (location: BeerLocation) => {
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
						description={loc.name}
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
				style={{
					backgroundColor: theme.elevation2,
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
				}}
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
	}
});

export { MapScreen };
