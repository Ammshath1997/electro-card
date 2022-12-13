import { Timestamp } from "firebase/firestore";
import { ProfileUser } from "./user-profile";

export interface Chat{
 id: string;
 lastMessage?: string;
 lastMessageData?: Date & Timestamp;
 userIds: string[];
 users: ProfileUser[];

 //Not Stored, only Display
 chatPic?: string;
 chatName?: string;
}

export interface Message {
    text: string;
    senderId: string;
    sentDate:Date & Timestamp;
}