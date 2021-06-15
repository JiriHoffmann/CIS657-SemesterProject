import React, { FunctionComponent, useEffect, useState } from 'react';
import { Keyboard, Pressable, TouchableOpacity, StyleSheet, Text, View, Dimensions} from 'react-native';
import { MapScreenNavigationProp } from '../types';
import { TextInput, Button} from 'react-native';
import { getMap } from '../api/API';
import MapView from 'react-native-maps';
import { registration } from '../firebase/Firebase';


const MapScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
	var test1: any = 38.9029289
	var test2: any = -77.0268085
	const [state, setState] = useState()


	function onRegionChange(region: any){
		setState(region)
	}


	return (
		
		<View style={styles.container}>
			 <View style={styles.container}>
				<MapView style={styles.map} 
				onRegionChange={onRegionChange}
				/>
			</View>
			
			<Button title={'do stuff'} onPress={() => {
				getMap(test1, test2, (data: any) => {
					console.log(data)
				})
			}

			} />

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#fff',
	  alignItems: 'center',
	  justifyContent: 'center',
	},
	map: {
	  width: Dimensions.get('window').width,
	  height: Dimensions.get('window').height,
	},
  });
  

export { MapScreen };
