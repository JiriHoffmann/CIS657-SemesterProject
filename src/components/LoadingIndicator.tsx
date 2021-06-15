import React, { FunctionComponent, useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming
} from 'react-native-reanimated';

interface Props {}

const LoadingIndicator: FunctionComponent<Props> = ({}) => {
	const progress = useSharedValue(0);

	useEffect(() => {
		progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, false);
	}, []);

	const beerOneStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ rotateZ: `${toDeg(interpolate(progress.value, [0, 0.5, 1], [0.15, -0.3, 0.15]))}deg` },
				{ translateX: interpolate(progress.value, [0, 0.5, 1], [0, 8, 0]) }
			]
		};
	});

	const beerTwoStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ rotateZ: `${toDeg(interpolate(progress.value, [0, 0.5, 1], [-0.3, 0.15, -0.3]))}deg` },
				{ translateX: interpolate(progress.value, [0, 0.5, 1], [0, -8, 0]) }
			]
		};
	});

	return (
		<View style={styles.container}>
			<Animated.View style={beerOneStyle}>
				<Text style={{ ...styles.textStyle, transform: [{ scaleX: -1 }] }}>🍺</Text>
			</Animated.View>
			<Animated.View style={beerTwoStyle}>
				<Text style={styles.textStyle}>🍺</Text>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	textStyle: {
		fontSize: 25
	}
});

const toDeg = (rad: number) => {
	'worklet';
	return (rad * 180) / Math.PI;
};

export { LoadingIndicator };
