import React, { FunctionComponent, useContext } from 'react';
import { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { register, signIn } from '../api/firebase/login';
import { LoadingIndicator } from '../components/LoadingIndicator';
import AppContext from '../contexts/AppContext';
import { LoginScreenNavigationProp } from '../types';

const LoginScreen: FunctionComponent<LoginScreenNavigationProp> = ({ route, navigation }) => {
	const { theme } = useContext(AppContext);
	const [signUpLoading, setSignUpLoading] = useState(false);
	const [logInLoading, setLogInLoading] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogInPress = async () => {
		setLogInLoading(true);
		await signIn(username, password).catch(() => {
			setLogInLoading(false);
		});
	};

	const handleSignUpPress = async () => {
		setSignUpLoading(true);
		await register(username, password).catch(() => {
			setSignUpLoading(false);
		});
	};

	return (
		<View style={{ ...styles.container, backgroundColor: theme.background }}>
			<TextInput
				placeholder='email'
				style={{
					...styles.textInput,
					backgroundColor: theme.elevation1
				}}
				onChangeText={setUsername}
				value={username}
			/>
			<TextInput
				placeholder='password'
				style={{
					...styles.textInput,
					backgroundColor: theme.elevation1
				}}
				secureTextEntry={true}
				onChangeText={setPassword}
				value={password}
			/>
			<View style={styles.buttonContainer}>
				<View style={{ ...styles.buttons, backgroundColor: theme.beerColor }}>
					<TouchableOpacity
						disabled={signUpLoading || logInLoading}
						onPress={handleLogInPress}
						style={styles.touchableButtons}
					>
						{logInLoading ? <LoadingIndicator /> : <Text style={{ color: 'white' }}>Login in</Text>}
					</TouchableOpacity>
				</View>

				<View style={{ ...styles.buttons, backgroundColor: theme.beerColor }}>
					<TouchableOpacity
						disabled={signUpLoading || logInLoading}
						onPress={handleSignUpPress}
						style={styles.touchableButtons}
					>
						{signUpLoading ? <LoadingIndicator /> : <Text style={{ color: 'white' }}>Sign up</Text>}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: '100%',
		alignItems: 'center',
		paddingTop: 50
	},
	textInput: {
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
	},
	buttonContainer: {
		width: '86%',
		flexDirection: 'row',
		marginTop: 20
	},
	touchableButtons: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttons: {
		flex: 1,
		marginHorizontal: 10,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
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

export { LoginScreen };
