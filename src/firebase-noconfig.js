import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const dbUsersRef = collection(db, "users")
export const dbPostsRef = collection(db, "posts")
export const dbCommentsRef = collection(db, "comments")
export const dbNotifsRef = collection(db, "notifs")
export const dbTicketsRef = collection(db, "tickets")
export const dbChatsRef = collection(db, "chats")
export const dbMessagesRef = collection(db, "messages")
export const dbMessageNotifsRef = collection(db, "messageNotifs")