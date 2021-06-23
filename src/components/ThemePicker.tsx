import React, { FunctionComponent, useContext, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme1, theme2, theme3, theme4 } from '../constants/Themes';
import AppContext from '../contexts/AppContext';

interface Props {}

const ThemePicker: FunctionComponent<Props> = ({}) => {
	const { user, theme, changeTheme } = useContext(AppContext);

	const themes = [theme1, theme2, theme3, theme4];

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Select you favourite beer color</Text>
			{themes.map((t) => {
				const isSelected = theme.name === t.name;
				return (
					<TouchableOpacity style={styles.optionContainer} onPress={() => changeTheme(t.name)} key={t.name}>
						<View
							style={{
								...styles.optionCheckBox,
								borderColor: t.beerColor,
								backgroundColor: isSelected ? theme.beerColor : 'white'
							}}
						></View>
						<Text style={styles.optionText}>{t.description}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingHorizontal: '7%'
	},
	title: {
		fontSize: 18,
		marginBottom: 10,
		fontWeight: 'bold'
	},
	optionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10
	},
	optionCheckBox: {
		width: 30,
		height: 30,
		borderWidth: 2,
		borderRadius: 30
	},
	optionText: {
		marginLeft: 10,
		fontSize: 17
	}
});

export { ThemePicker };
