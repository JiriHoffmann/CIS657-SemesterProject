import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppContext from '../contexts/AppContext';
import { ChatPreview } from '../types/Chat';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ONE_DAY = 24 * 60 * 60;

interface Props {
	chat: ChatPreview;
	onPress: () => void;
}

const ChatPreviewTab: FunctionComponent<Props> = ({ chat, onPress }) => {
	const { user } = useContext(AppContext);
	const today = new Date().setHours(0, 0, 0, 0);
	const timestampDay = new Date(chat.timestamp).setHours(0, 0, 0, 0);
	const date =
		today === timestampDay
			? new Date(chat.timestamp).toLocaleString('en-US', { hour: 'numeric', hour12: true }).substr(11, 5)
			: new Date(chat.timestamp).toLocaleString('en-US', { hour: 'numeric', hour12: true });

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.container}>
				<Text style={styles.title}>{chat.name}</Text>
				<Text style={styles.sender}>From: {chat.senderName === user?.email ? 'You' : chat.senderName}</Text>
				<Text numberOfLines={1} style={styles.description}>
					{chat.content}
				</Text>
				<Text style={styles.timestamp}>{date}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
		marginLeft: 10
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	sender: {
		fontSize: 18,
		marginBottom: 2
	},
	description: {
		fontSize: 18,
		color: 'gray'
	},
	timestamp: {
		position: 'absolute',
		right: 0
	}
});

export { ChatPreviewTab };
