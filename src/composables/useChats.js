import { ref, onUnmounted } from 'vue'
import { query, where, orderBy, onSnapshot, getDocs, addDoc } from 'firebase/firestore'
import { dbChatsRef, dbUsersRef } from '../firebase'
import { useRouter } from 'vue-router'

export default function useChats() {
    const router = useRouter()
    const chatsList = ref([])
    const unsubscribeFromChats = ref(() => {})

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
    }

    async function makeChat(user, username) {
        const reqUser = await checkUserExists(username)
        if (!reqUser) return alert('User not found')
        const chat = {
            users: [user.username, reqUser.data().username],
            createdAt: new Date()
        }
        const chatDoc = await addDoc(dbChatsRef, chat)
        router.push({ path: `/chat/${chatDoc.id}` })
    }

    onUnmounted(() => {
        unsubscribeFromChats.value()
    })

    return {
        chatsList,
        getChats,
        makeChat
    }
}