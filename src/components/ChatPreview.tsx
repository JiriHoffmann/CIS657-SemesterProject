import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChatPreview } from '../types/Chat';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
	chat: ChatPreview;
	onPress: () => void;
}

const ChatPreviewTab: FunctionComponent<Props> = ({ chat, onPress }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.container}>
				<Text style={styles.title}>{chat.senderName}</Text>
				<Text numberOfLines={1} style={styles.description}>
					{chat.content}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
		marginLeft: 10
	},
	title: {
		fontSize: 21,
		marginBottom: 3
	},
	description: {
		fontSize: 14,
		width: SCREEN_WIDTH - 130
	}
});

export { ChatPreviewTab };
