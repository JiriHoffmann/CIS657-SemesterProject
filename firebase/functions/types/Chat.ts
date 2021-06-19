export interface ChatPreview {
	id: string;
	content: string;
	senderID: string;
	senderName: string;
	timestamp: number;
	name: string;
}

export interface ChatDetail {
	id: string;
	createdAt: string;
	members: ChatMember[];
	name: string;
}

export interface Message {
	content: string;
	senderID: string;
	senderName: string;
	timestamp: number;
}

export interface ChatMember {
	id: string;
	email: string;
}

export interface User {
	expoToken: string;
	email: string;
}
