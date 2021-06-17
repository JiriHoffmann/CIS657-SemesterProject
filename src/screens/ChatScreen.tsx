import React, { FunctionComponent, useLayoutEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { findUserByEmail } from '../api/firebase/chat';
import { ChatPreviewTab } from '../components/ChatPreview';
import AppContext from '../contexts/AppContext';
import { useKeyboardListener } from '../scripts/useKeyboard';
import { ChatScreenNavigationProp } from '../types';
import { AddNewUser, ChatPreview } from '../types/Chat';

const emailRegex = new RegExp(
	"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
);

const ChatScreen: FunctionComponent<ChatScreenNavigationProp> = ({ navigation }) => {
	const { user, theme } = useContext(AppContext);
	const addNewChatInputRef = useRef<TextInput>(null);

	const { keyboardShown, keyboardHeight } = useKeyboardListener();

	const [chats, setChats] = useState<ChatPreview[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddNewChatModal, setShowAddNewChatModal] = useState(false);
	const [addNewUserInput, setAddNewUserInput] = useState('');
	const [addUserLoading, setAddUserLoading] = useState(false);
	const [addNewChatUsers, setAddNewChatUsers] = useState<AddNewUser[]>([]);

	const handleOpenChatPress = (chatPreview: ChatPreview) => {
		// TODO:
	};

	const handleAddNewUserPress = async () => {
		setAddUserLoading(true);
		if (addNewUserInput.toLowerCase() === user?.email?.toLowerCase()) {
			Alert.alert('Ooops', `You can't chat with yourself.`);
		} else if (!emailRegex.test(addNewUserInput)) {
			Alert.alert('Ooops', `Not a valid email.`);
		} else {
			await findUserByEmail(addNewUserInput)
				.then((user) => {
					setAddNewChatUsers([...addNewChatUsers, user]);
					setAddNewUserInput('');
				})
				.catch(() => {
					Alert.alert('Ooops', 'User not found.');
				});
		}
		setAddUserLoading(false);
	};

	const handleAddNewChatDone = () => {
		// TODO:
	};

	const handleAddNewChatCancel = () => {
		setShowAddNewChatModal(false);
		setAddNewChatUsers([]);
		setAddNewUserInput('');
	};

	useLayoutEffect(() => {
		if (showAddNewChatModal) addNewChatInputRef.current?.focus();
	}, [showAddNewChatModal]);

	return (
		<View style={styles.container}>
			{loading && <ActivityIndicator size={'large'} color={theme.beerColor} />}
			<FlatList
				showsVerticalScrollIndicator={false}
				style={styles.container}
				data={chats}
				keyExtractor={(item, index) => item.id ?? `${index}`}
				renderItem={({ item }) => {
					return <ChatPreviewTab chat={item} onPress={() => handleOpenChatPress(item)} />;
				}}
			/>

			{!loading && chats.length === 0 && (
				<Text style={styles.noMessageText}>
					'Looks like you have no messages. You can send a new one by pressing the + button',
				</Text>
			)}

			{/* Add new chat button  */}
			{!showAddNewChatModal && (
				<TouchableOpacity
					style={{ ...styles.addButton, backgroundColor: theme.beerColor }}
					onPress={() => setShowAddNewChatModal(true)}
				>
					<Text style={styles.addButtonPlus}>+</Text>
				</TouchableOpacity>
			)}

			{showAddNewChatModal && (
				<View style={styles.addNewChatModal}>
					<Text style={styles.addNewUserText}>Add new user</Text>
					<View style={styles.addNewUserInputContainer}>
						<TextInput
							ref={addNewChatInputRef}
							placeholder='User email'
							editable={!addUserLoading}
							style={{
								...styles.textInput,
								backgroundColor: theme.elevation1
							}}
							onSubmitEditing={handleAddNewUserPress}
							onChangeText={setAddNewUserInput}
							value={addNewUserInput}
						/>
						<TouchableOpacity
							style={{ ...styles.addNewUserAddButton, backgroundColor: theme.beerColor }}
							onPress={handleAddNewUserPress}
							disabled={addUserLoading}
						>
							{addUserLoading ? (
								<ActivityIndicator size={'large'} color={'white'} />
							) : (
								<Text style={styles.addNewUserAddButtonText}>Add</Text>
							)}
						</TouchableOpacity>
					</View>
					<Text style={styles.addNewUserAddedCountText}>{`Added Users: ${addNewChatUsers.length}`}</Text>
					<FlatList
						showsVerticalScrollIndicator={false}
						style={styles.container}
						data={addNewChatUsers}
						keyExtractor={(_, index) => `${index}`}
						renderItem={({ item }) => {
							return <Text>{item?.email}</Text>;
						}}
					/>
					<View style={{ ...styles.bottomButtons, bottom: keyboardShown ? keyboardHeight : 10 }}>
						<TouchableOpacity
							style={{ ...styles.bottomButtonsButton, backgroundColor: theme.beerColor }}
							onPress={handleAddNewChatDone}
						>
							<Text style={styles.addNewUserAddButtonText}>Done</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{ ...styles.bottomButtonsButton, backgroundColor: 'darkgray' }}
							onPress={handleAddNewChatCancel}
						>
							<Text style={styles.addNewUserAddButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	noMessageText: {
		position: 'absolute',
		top: 100,
		width: '100%',
		paddingHorizontal: '8%',
		textAlign: 'center',
		fontSize: 20,
		color: 'gray'
	},
	addButton: {
		position: 'absolute',
		bottom: 20,
		right: 10,
		width: 50,
		height: 50,
		borderRadius: 25,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	addButtonPlus: {
		fontSize: 40,
		color: 'white',
		marginTop: 2,
		includeFontPadding: false
	},
	addNewChatModal: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'white',
		paddingHorizontal: '5%'
	},
	addNewUserText: {
		marginTop: 20,
		fontSize: 20
	},
	addNewUserInputContainer: {
		flexDirection: 'row'
	},
	addNewUserAddButton: {
		width: 60,
		height: 47,
		borderRadius: 30,
		marginVertical: 9,
		marginLeft: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	addNewUserAddButtonText: {
		includeFontPadding: false,
		color: 'white',
		fontSize: 16
	},
	addNewUserAddedCountText: {
		color: 'gray',
		fontSize: 16,
		marginTop: 15,
		marginBottom: 5
	},
	textInput: {
		flex: 1,
		height: 45,
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
	bottomButtons: {
		position: 'absolute',
		flexDirection: 'row',
		width: '100%',
		marginHorizontal: '7%'
	},
	bottomButtonsButton: {
		flex: 1,
		height: 45,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginHorizontal: 10
	}
});

export { ChatScreen };
