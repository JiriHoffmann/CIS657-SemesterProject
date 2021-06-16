import React, { FunctionComponent, useEffect, useState } from 'react';
import { Keyboard, Pressable, TouchableOpacity, StyleSheet, Text, View, Dimensions} from 'react-native';
import { MapScreenNavigationProp } from '../types';
import { TextInput, Button} from 'react-native';
import { getMap } from '../api/API';
import MapView, { Marker } from 'react-native-maps';



const MapScreen: FunctionComponent<MapScreenNavigationProp> = ({ route, navigation }) => {
	var test1: any = 38.9029289
	var test2: any = -77.0268085
	const [state, setState] = useState(Object)
	const [data, setData] = useState([])
	

	useEffect(() =>{
		getMapData(state.latitude, state.longitude)
	}, [])

	function onRegionChange(region: any){
		setState(region)
		console.log(state.latitude)
		console.log(state.longitude)
		//getMapData(state.latitude, state.longitude)
	}

	async function getMapData(lat: any, long: any){
		console.log("here")
		const mapData = await getMap(lat, long)
		console.log(mapData.locations)
		setData(mapData.locations)
		//return mapData
	}

	const mapMarkers = () => {
		//getMapData(lat, lon)
		return data.map((mapData: any) => { return <Marker
		key={mapData.id}
		coordinate={{latitude: Number(mapData.lat), longitude: Number(mapData.lng)}}
		title={mapData.name}
		description={mapData.name}

		>
		</Marker>})
	}

	


	return (
		
		<View style={styles.container}>
			 <View style={styles.container}>
				<MapView 
				style={styles.map} 
				initialRegion={{
					latitude: 42.460584030103824,
					longitude: -86.22584420479463,
					latitudeDelta: 3,
					longitudeDelta: 3
				}}
				region={state.region}
				onRegionChange={onRegionChange}
				showsUserLocation={true}
				>
				

				{mapMarkers()}
					

				</MapView>
			</View>
			
			<Button title={'do stuff'} onPress={async () => {
				console.log(getMapData(test1, test2))
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
