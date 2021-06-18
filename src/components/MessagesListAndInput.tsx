import React, { Dispatch, FunctionComponent, SetStateAction, useContext, useLayoutEffect, useRef } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pressable } from 'react-native';
import { TextInput } from 'react-native';
import { ActivityIndicator } from 'react-native';
import Animated, { runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import AppContext from '../contexts/AppContext';
import { useKeyboardListener } from '../scripts/useKeyboard';
import { Message } from '../types/Chat';

const FETCH_MORE_DISTANCE = 50;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const MARGIN = SCREEN_WIDTH * 0.02;
const MESSAGE_WIDTH = SCREEN_WIDTH - MARGIN * 2 - 70;

interface Props {
	fetchingMore: Animated.SharedValue<boolean>;
	loading: boolean;
	textInputFocus: boolean;
	setTextInputFocus: Dispatch<SetStateAction<boolean>>;
	textInput: string;
	setTextInput: Dispatch<SetStateAction<string>>;
	messages: Message[];
	messageLimit: number;
	sending: boolean;
	handleSendMessage: () => void;
	handleFetchMore: () => void;
	members: string[];
}

const MessagesListAndInput: FunctionComponent<Props> = ({
	fetchingMore,
	loading,
	textInputFocus,
	setTextInputFocus,
	textInput,
	setTextInput,
	messages,
	messageLimit,
	sending,
	handleSendMessage,
	handleFetchMore,
	members
}) => {
	const { user, theme } = useContext(AppContext);
	const { keyboardShown, keyboardHeight } = useKeyboardListener(
		() => {},
		() => setTextInputFocus(false)
	);
	const flatlistRef = useRef<FlatList>(null);
	const textInputRef = useRef<TextInput>(null);
	const hiddenTextInputRef = useRef<TextInput>(null);
	const inputOverlayAnim = useSharedValue<number>(0);

	useLayoutEffect(() => {
		if (textInputFocus) {
			inputOverlayAnim.value = 1;
		} else {
			inputOverlayAnim.value = 0;
		}
	}, [textInputFocus]);

	const keyExtractor = (item: any) => `${item.timestamp}`;

	const handleInputPress = () => {
		hiddenTextInputRef.current?.focus();
		setTimeout(() => {
			textInputRef.current?.focus();
		}, 500);
	};

	const inputOverlayStyle = useAnimatedStyle(() => {
		return {
			position: 'absolute',
			width: '100%',
			height: 80,
			bottom: 0,
			transform: [{ translateY: inputOverlayAnim.value === 1 ? -SCREEN_WIDTH : 0 }]
		};
	});

	const onRefresh = React.useCallback(async () => {
		handleFetchMore();
	}, [fetchingMore]);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			if (
				event.contentSize.height - event.layoutMeasurement.height - event.contentOffset.y <
					FETCH_MORE_DISTANCE &&
				!fetchingMore.value &&
				messages.length === messageLimit
			) {
				fetchingMore.value = true;
				runOnJS(onRefresh)();
			}
		}
	});

	const footerStyle = useAnimatedStyle(() => ({
		width: '100%',
		height: FETCH_MORE_DISTANCE,
		opacity: fetchingMore.value ? 1 : 0
	}));

	const AnimatedFooter = () => {
		return (
			<Animated.View style={footerStyle}>
				<ActivityIndicator color={theme.beerColor} size={'large'} />
			</Animated.View>
		);
	};

	return (
		<SafeAreaView style={{ ...styles.container, backgroundColor: theme.elevation1 }}>
			{/* Fake text input that is focused on the actuall 
                input press to bring up keyboard and 
                get it's measurements
            */}
			<TextInput ref={hiddenTextInputRef} style={styles.fakeInput} />

			{/* Loading indicator */}
			{loading && messages.length === 0 && <ActivityIndicator color={theme.beerColor} size='large' />}

			<View style={{ ...styles.listAndInputContainer, marginBottom: keyboardShown ? keyboardHeight + 40 : 0 }}>
				{/* TEXT INPUT */}
				<View style={{ ...styles.textInputContainer, backgroundColor: theme.elevation1 }}>
					<TextInput
						ref={textInputRef}
						style={styles.textInput}
						value={textInput}
						onChangeText={setTextInput}
						onFocus={() => setTextInputFocus(true)}
						placeholder={'Send message...'}
						placeholderTextColor={'gray'}
						multiline
					/>
					<Animated.View style={inputOverlayStyle}>
						<Pressable onPress={handleInputPress} style={{ flex: 1 }} />
					</Animated.View>

					{!loading && messages.length === 0 && (
						<Text style={styles.startConversationText}>Send a message to start a conversation.</Text>
					)}
					<TouchableOpacity
						onPress={handleSendMessage}
						disabled={textInput.replace(' ', '') === '' || sending || loading}
					>
						<MaterialIcons name={'send'} size={30} color={textInput !== '' ? theme.beerColor : 'gray'} />
					</TouchableOpacity>
				</View>

				{/* MESSAGE LIST */}
				<AnimatedFlatList
					overScrollMode='always'
					keyboardShouldPersistTaps='always'
					ref={flatlistRef}
					style={{ flex: 1 }}
					keyExtractor={keyExtractor}
					data={messages}
					onScroll={scrollHandler}
					inverted
					ListFooterComponent={AnimatedFooter}
					renderItem={({ item, index }) => {
						let message = item as Message;
						const prevMessage = messages[index + 1];
						const isUser = message.senderID === user?.uid;
						const isFromSameUserAsPrev = message.senderID === prevMessage?.senderID;
						return (
							<View
								style={{
									...styles.messageContainer,
									marginBottom: index === 0 ? 20 : 0,
									marginTop: isFromSameUserAsPrev ? 5 : 20,
									alignItems: isUser ? 'flex-end' : 'flex-start'
								}}
							>
								<View
									style={{
										alignItems: isUser ? 'flex-end' : 'flex-start'
									}}
								>
									{!isFromSameUserAsPrev && <Text>{message.senderName}</Text>}
									<Text>
										<View
											style={{
												...styles.messageTextContainer,
												backgroundColor: isUser ? theme.beerColor : theme.elevation3
											}}
										>
											<Text style={{ color: isUser ? 'white' : 'black' }}>{message.content}</Text>
										</View>
									</Text>
								</View>
							</View>
						);
					}}
				/>
				<View style={{ ...styles.membersContainer, backgroundColor: theme.elevation2 }}>
					<Text style={styles.membersText}>{members.join(', ')}</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	fakeInput: {
		position: 'absolute',
		width: 0,
		height: 0,
		top: 50
	},
	listAndInputContainer: {
		flex: 1,
		width: '100%',
		height: 500,
		flexDirection: 'column-reverse',
		justifyContent: 'flex-end'
	},
	textInputContainer: {
		width: SCREEN_WIDTH,
		height: 70,
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: '2%'
	},
	textInput: {
		height: 40,
		width: MESSAGE_WIDTH,
		marginHorizontal: 15,
		marginTop: -5,
		borderBottomColor: 'black',
		borderBottomWidth: 1
	},
	messageContainer: { paddingHorizontal: MARGIN },
	messageTextContainer: {
		paddingVertical: 10,
		borderRadius: 25,
		marginHorizontal: 10,
		maxWidth: MESSAGE_WIDTH,
		paddingHorizontal: 15
	},
	startConversationText: {
		position: 'absolute',
		width: SCREEN_WIDTH,
		textAlign: 'center',
		bottom: 80,
		opacity: 0.6,
		color: 'gray'
	},
	membersContainer: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		paddingHorizontal: 20,
		paddingVertical: 10
	},
	membersText: {
		fontSize: 17
	}
});

export { MessagesListAndInput };
