import * as Location from 'expo-location';
import React, { FunctionComponent, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import AppContext from '../contexts/AppContext';
import { UserLocation } from '../types/BeerMapping';

interface ButtonProps {
	locationCallback: (coords: UserLocation) => void;
	searchOnMount?: boolean;
	style?: StyleProp<ViewStyle>;
	backgroundColor?: string;
}

const LocationSearchButton: FunctionComponent<ButtonProps> = ({
	searchOnMount = false,
	locationCallback,
	style,
	backgroundColor
}) => {
	const { theme } = useContext(AppContext);

	const [searching, setSearching] = useState(false);
	const [hasPermission, setHasPermission] = useState<boolean>(true);
	const [location, setLocation] = useState<UserLocation | null>(null);

	const spinAnimation = useSharedValue(0);

	useEffect(() => {
		let count = 0;
		if (spinAnimation.value !== 0) {
			count = 1;
			spinAnimation.value = withRepeat(withTiming(1.5, { duration: 2500 }), count, true);
		}
		if (searching) {
			count = -1;
			if ((spinAnimation.value = 1.5)) {
				spinAnimation.value = 0;
			}
			spinAnimation.value = withRepeat(withTiming(1.5, { duration: 2500 }), count, true);
		}
	}, [searching]);

	useLayoutEffect(() => {
		if (searchOnMount) {
			searchLocation();
		}
	}, []);

	const searchLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			setHasPermission(false);
			return;
		}
		setHasPermission(true);
		setSearching(true);
		Location.getCurrentPositionAsync({})
			.then((location) => {
				if (location.coords) {
					setLocation(location.coords);
					locationCallback(location.coords);
				}
			})
			.finally(() => setSearching(false));
	};

	const icon = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotateY: `${toDeg(Math.PI * 2 * spinAnimation.value)}deg`
				}
			]
		};
	});

	return (
		<TouchableOpacity
			onPress={searchLocation}
			style={[backgroundColor ? styles.container : styles.containerWithoutBackground, { backgroundColor }, style]}
		>
			{!hasPermission ? (
				<Text style={{ color: theme.primary, fontSize: 18, marginTop: -3 }}>?</Text>
			) : (
				<Animated.View style={[icon]}>
					<MaterialIcons
						name={'person-pin-circle'}
						size={35}
						color={location !== null && hasPermission ? theme.beerColor : 'gray'}
					/>
				</Animated.View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 50,
		height: 50,
		borderRadius: 25,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	containerWithoutBackground: {
		width: 50,
		height: 50,
		borderRadius: 25,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

const toDeg = (rad: number) => {
	'worklet';
	return (rad * 180) / Math.PI;
};
export { LocationSearchButton };
