import React, { FunctionComponent, useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import AppContext from '../contexts/AppContext';
import { LoginScreenNavigationProp } from '../types';

const LoginScreen: FunctionComponent<LoginScreenNavigationProp> = ({ route, navigation }) => {
	const { setUser } = useContext(AppContext);
	return (
		<View style={styles.container}>
			<Text>Login Screen</Text>
			<Button title={'Login in'} onPress={() => setUser('TestUser')} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export { LoginScreen };
