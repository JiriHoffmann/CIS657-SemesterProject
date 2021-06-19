import React, { FunctionComponent, useEffect, useState } from 'react';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { multiply, useSharedValue } from 'react-native-reanimated';
import { sendFirstMessage, sendMessage, subscribeToChat } from '../api/firebase/chat';
import { MessagesListAndInput } from '../components/MessagesListAndInput';
import AppContext from '../contexts/AppContext';
import { ChatDetailScreenNavigationProp } from '../types';
import { ChatDetail, Message } from '../types/Chat';

const LIMIT = 50;

const ChatDetailScreen: FunctionComponent<ChatDetailScreenNavigationProp> = ({ route, navigation }) => {
	const { user, theme } = useContext(AppContext);

	const newChatUsers = route.params.newChatUsers;
	const chatName = route.params.chatName;
	const chatIDProp = route.params.chatID;

	const fetchingMore = useSharedValue<boolean>(false);

	const [loading, setLoading] = useState<boolean>(false);
	const [sending, setSending] = useState<boolean>(false);
	const [chatID, setChatID] = useState<string | null>(chatIDProp ?? null);
	const [chatDetail, setChatDetail] = useState<ChatDetail | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [textInput, setTextInput] = useState<string>('');
	const [textInputFocus, setTextInputFocus] = useState<boolean>(false);
	const [messageLimit, setMessageLimit] = useState<number>(LIMIT);

	useEffect(() => {
		navigation.setOptions({ headerTitle: chatName ?? chatDetail?.name ?? '' });
	}, []);

	console.log(messages[0]);

	// subscribe to chat
	useEffect(() => {
		const unsubscribe = subscribeToChat(
			chatID,
			chatDetail === null ? true : false,
			(d) => setChatDetail(d),
			(d) => {
				setMessages(d);
				if (loading) setLoading(false);
				fetchingMore.value = false;
			},
			messageLimit
		);
		return () => unsubscribe();
	}, [chatID, messageLimit]);

	const handleSendMessage = async () => {
		setSending(true);
		if (!chatDetail && chatName && newChatUsers) {
			const info = await sendFirstMessage(
				{ id: user?.uid!, email: user?.email! },
				chatName,
				newChatUsers,
				textInput
			);
			setChatID(info.id);
			setChatDetail(info);
		} else {
			if (chatDetail) sendMessage({ id: user?.uid!, email: user?.email! }, chatDetail, textInput);
		}

		setSending(false);
		setTextInput('');
	};

	const handleFetchMore = () => {
		setMessageLimit(messageLimit + LIMIT);
	};

	return (
		<>
			{/* <View
        style={{
          height: StatusBar.currentHeight ?? 0,
          width: '100%',
          backgroundColor: theme.elevation2,
        }}
      /> */}
			<MessagesListAndInput
				{...{
					fetchingMore,
					loading,
					textInputFocus,
					setTextInputFocus,
					textInput,
					setTextInput,
					messages,
					sending,
					handleSendMessage,
					handleFetchMore,
					messageLimit
				}}
				members={
					newChatUsers?.map((u) => u.email) ??
					chatDetail?.members.filter((m) => m.id !== user?.uid).map((m) => m.email) ??
					[]
				}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export { ChatDetailScreen };
function useMount(arg0: () => void, arg1: never[]) {
	throw new Error('Function not implemented.');
}
