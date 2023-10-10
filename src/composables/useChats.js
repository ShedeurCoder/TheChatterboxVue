import { ref, onUnmounted } from 'vue'
import { query, where, orderBy, onSnapshot, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { dbChatsRef, dbMessageNotifsRef, dbUsersRef } from '../firebase'
import { useRouter, useRoute } from 'vue-router'

export default function useChats() {
    const router = useRouter()
    const route = useRoute()
    const chatsList = ref([])
    const unsubscribeFromChats = ref(() => {})
    const notifs = ref([])
    const unsubscribeFromNotifs = ref(() => {})

    async function getNotifs(username) {
        try {
            const queryData = query(dbMessageNotifsRef, where('to', '==', username))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                notifs.value = []
                docs.forEach(async (document) => {
                    if (document.data().chat === route.params.chatId) {
                        await deleteDoc(doc(dbMessageNotifsRef, document.id))
                    } else {
                        const notif = {
                            id: document.id,
                            ...document.data()
                        }
                        notifs.value.push(notif)
                    }
                })
            })
            unsubscribeFromNotifs.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function checkUserExists(username) {
        try {
            const queryData = query(dbUsersRef, where('username', '==', username))
            const user = await getDocs(queryData)
            if (user.docs[0]) {
                return user.docs[0]
            } else {
                return false
            }
        } catch(e) {
            console.error(e)
        }
    }

    function getChats(user) {
        try {
            const queryData = query(dbChatsRef, where('users', 'array-contains', user.username), orderBy('createdAt'))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                chatsList.value = []
                docs.forEach((doc) => {
                    const chat = {
                        id: doc.id,
                        ...doc.data()
                    }
                    chatsList.value.push(chat)
                })
                chatsList.value.reverse()
            })
            unsubscribeFromChats.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function makeChat(user, username) {
        try {
            const reqUser = await checkUserExists(username)
            if (!reqUser) return alert('User not found')
            if (reqUser.data().dm === false) return alert('User has closed their DMs')
            const chat = {
                users: [user.username, reqUser.data().username],
                createdAt: new Date()
            }
            const chatDoc = await addDoc(dbChatsRef, chat)
            router.push({ path: `/chat/${chatDoc.id}` })
        } catch(e) {
            console.error(e)
        }
    }

    onUnmounted(() => {
        unsubscribeFromChats.value()
    })

    return {
        chatsList,
        getChats,
        makeChat,
        notifs,
        getNotifs,
        unsubscribeFromNotifs
    }
}