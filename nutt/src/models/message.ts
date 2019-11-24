import { User } from "./user";

export interface Message {
    uid: string; // Reciever ID
    sid: string; // Sender ID 
    message: string; // Text message
    date: string; // Date sent
    isRead?: boolean; // Date sent
}

export interface MessageData {
    message: Message,
    user: User
}