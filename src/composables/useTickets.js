import { ref, onUnmounted } from 'vue'
import { addDoc, query, orderBy, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { dbTicketsRef, db } from '../firebase'

export default function useTickets() {
    const ticketMessage = ref('')
    const unsubscribeFromUserTickets = ref(() => {})
    const unsubscribeFromTicket = ref(() => {})
    const userTickets = ref(null)
    const ticketData = ref(null)

    async function makeTicket(username, type, email, name, details) {
        try {
            ticketMessage.value = ''
            const ticket = {
                username,
                type,
                email,
                name,
                details,
                createdAt: new Date(),
                replies: [],
                open: true
            }
            await addDoc(dbTicketsRef, ticket)
            ticketMessage.value = 'Ticket sent.'
        } catch(e) {
            ticketMessage.value = 'Error making ticket. Please try again later or try emailing us.'
            console.error(e)
        }
    }

    async function getUserTickets(username) {
        try {
            userTickets.value = []
            const queryData = query(dbTicketsRef, where('username', '==', username), orderBy('createdAt'))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                userTickets.value = []
                docs.forEach((doc) => {
                    const post = {
                        id: doc.id,
                        ...doc.data()
                    }
                    userTickets.value.push(post)
                })
                userTickets.value.reverse()
            })
            unsubscribeFromUserTickets.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    function getTicket(id) {
        try {
            const docRef = doc(db, "tickets", id)
            const unsubscribe = onSnapshot(docRef, (doc) => {
                const ticket = {
                    id: doc.id,
                    ...doc.data()
                }
                ticketData.value = ticket
            })
            unsubscribeFromTicket.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function createComment(ticket, message, user) {
        try {
            const comment = {
                username: user.username,
                admin: user.admin ?? false,
                message,
                createdAt: new Date()
            }

            await updateDoc(doc(db, "tickets", ticket.id), {
                replies: [comment, ...ticket.replies]
            });
        } catch(e) {
            console.error(e)
        }
    }

    async function closeTicket(id) {
        try {
            await updateDoc(doc(db, "tickets", id), {
                open: false
            });
        } catch(e) {
            console.error(e)
        }
    }

    onUnmounted(() => {
        unsubscribeFromUserTickets.value()
    })

    return {
        ticketMessage,
        makeTicket,
        getUserTickets,
        userTickets,
        ticketData, 
        getTicket,
        unsubscribeFromTicket,
        createComment,
        closeTicket
    }
}