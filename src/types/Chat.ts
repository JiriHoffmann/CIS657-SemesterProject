export interface ChatPreview {
	id: string;
	content: string;
	read: boolean;
	notified: boolean;
	senderID: string;
	senderName: string;
	timestamp: number;
	recievers: string[];
}

export interface ChatDetail {
	id: string;
	createdAt: string;
	membersID: string[];
}

export interface Message {
	content: string;
	senderID: string;
	senderName: string;
	timestamp: number;
}

export interface AddNewUser {
	id: string;
	email: string;
}
