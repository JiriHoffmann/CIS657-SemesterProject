import React, { FunctionComponent, useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { Button, StyleSheet, Text, View } from 'react-native';
import {Input} from 'react-native-elements';
import AppContext from '../contexts/AppContext';
import { initDb, setUpData, write } from '../firebase/Firebase';
import { LoginScreenNavigationProp } from '../types';

const LoginScreen: FunctionComponent<LoginScreenNavigationProp> = ({ route, navigation }) => {

	useEffect(() => {
		try {
			initDb();
		} catch (err) {
			console.log(err);
		}
		setUpData('test')
	}, []);

	const { setUser } = useContext(AppContext);
	const [username, setUsername] = useState({name: ''});
	const [password, setPassword] = useState({name: ''})
	return (
		<View style={styles.container}>
			<Text style={{fontSize: 20, fontWeight: 'bold', color: 'orange', marginBottom: 50}}>Login To Beer Me!</Text>
			<Input placeholder="email" style={{borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderTopWidth: 2, width: 250, height: 30}}
		
			></Input>
			<Input placeholder="password" style={{borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderTopWidth: 2, width: 250, height: 30}}></Input>
			<Button title={'Login in'} onPress={() => 
				setUser('TestUser')
			} />
			<Button title={'Sign up'} onPress={() => setUser('TestUser')}  />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 100
	}
});

export { LoginScreen };
