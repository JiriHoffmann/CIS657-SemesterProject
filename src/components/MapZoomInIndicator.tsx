import React, { FunctionComponent, useContext, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
	cos,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming
} from 'react-native-reanimated';

interface Props {
	show: boolean;
	style: StyleProp<ViewStyle>;
}

const MapZoomInIndicator: FunctionComponent<Props> = ({ show, style }) => {
	const progress = useSharedValue(0);

	useEffect(() => {
		if (show) {
			progress.value = withTiming(1, { duration: 500 });
		} else {
			progress.value = withTiming(0, { duration: 500 });
		}
	}, [show]);

	const containerStyle = useAnimatedStyle(() => {
		return {
			opacity: progress.value,
			transform: [{ translateY: interpolate(progress.value, [0, 1], [-40, 0]) }]
		};
	});

	return (
		<Animated.View style={[style, containerStyle]}>
			<Text style={styles.textStyle}>Zoom in to see new locations</Text>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	textStyle: {
		fontSize: 18
	}
});

export { MapZoomInIndicator };
