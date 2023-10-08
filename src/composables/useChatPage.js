import { ref, onUnmounted, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { onSnapshot, doc, addDoc, orderBy, query, where, deleteDoc, getDocs } from 'firebase/firestore'
import { dbChatsRef, dbMessagesRef } from '../firebase'

export default function useChatPage() {
    const route = useRoute()
    const chatId = ref(route.params.chatId)
    const chatData = ref({})
    const messagesArray = ref([])
    const unsubscribeFromChat = ref(() => {})
    const unsubscribeFromMessages = ref(() => {})

    function getChat(id) {
        try {
            const queryData = doc(dbChatsRef, id)
            const unsubscribe = onSnapshot(queryData, (doc) => {
                const chat = {
                    id: doc.id,
                    ...doc.data()
                }
                chatData.value = chat
            })
            unsubscribeFromChat.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function newMessage(user, text, chatId) {
        const message = {
            user: user.username,
            createdAt: new Date(),
            text,
            chatId,
            pfp: user.pfp ?? 'defaultProfile_u6mqts'
        }
        await addDoc(dbMessagesRef, message)
    }

    async function getMessages(chatId) {
        try {
            const queryData = query(dbMessagesRef, where('chatId', '==', chatId), orderBy('createdAt'))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                messagesArray.value = []
                docs.forEach((doc) => {
                    const message = {
                        id: doc.id,
                        ...doc.data()
                    }
                    messagesArray.value.push(message)
                })
                document.getElementById('scrollTo').scrollIntoView()
            })
            unsubscribeFromMessages.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function deleteMessage(id) {
        try {
            await deleteDoc(doc(dbMessagesRef, id))
        } catch(e) {
            console.error(e)
        }
    }

    async function deleteChat(id) {
        try {
            const deleteConfirm = confirm('Are you sure you want to delete this chat? Messages will be unable to recover!!')

            if (deleteConfirm) {
                // delete messages
                const queryData = query(dbMessagesRef, where('chatId', '==', id))
                const messages = await getDocs(queryData)
                messages.forEach(async (document) => {
                    await deleteDoc(doc(dbMessagesRef, document.id))
                })
    
                await deleteDoc(doc(dbChatsRef, id))
            }
        } catch(e) {
            console.error(e)
        }
    }

    onUnmounted(() => {
        unsubscribeFromChat.value()
        unsubscribeFromMessages.value()
    })

    onMounted(() => {
        getChat(route.params.chatId)
        getMessages(route.params.chatId)
    })

    onBeforeRouteUpdate((to) => {
        unsubscribeFromChat.value()
        unsubscribeFromMessages.value()
        chatId.value = to.params.chatId
        getChat(to.params.chatId)
        getMessages(to.params.chatId)
    })

    return {
        chatId,
        chatData,
        newMessage,
        messagesArray,
        deleteMessage,
        deleteChat
    }
}