import React, { FunctionComponent } from 'react';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import AppContext from '../contexts/AppContext';
import { ChatScreenNavigationProp } from '../types';

const ChatDetailScreen: FunctionComponent<ChatScreenNavigationProp> = ({ navigation }) => {
	const { user, theme } = useContext(AppContext);

	return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export { ChatDetailScreen };
