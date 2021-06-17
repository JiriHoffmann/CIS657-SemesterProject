import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export const useKeyboardListener = (
	onKeyboardShow: () => void = () => {},
	onKeyboardHide: () => void = () => {}
): {
	keyboardShown: boolean;
	keyboardHeight: number;
} => {
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [shown, setShown] = useState(false);

	function onKeyboardDidShow(e: KeyboardEvent): void {
		setKeyboardHeight(e.endCoordinates.height);
		setShown(true);
		onKeyboardShow();
	}

	function onKeyboardDidHide(): void {
		setKeyboardHeight(0);
		setShown(false);
		onKeyboardHide();
	}

	useEffect(() => {
		Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
		Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
		return (): void => {
			Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
			Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
		};
	}, []);

	return { keyboardShown: shown, keyboardHeight };
};
