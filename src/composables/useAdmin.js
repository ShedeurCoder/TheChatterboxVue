import { ref, onUnmounted, onMounted } from 'vue'
import { query, orderBy, where, onSnapshot, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { dbTicketsRef, dbPostsRef, dbCommentsRef, dbUsersRef, db } from '../firebase'

export default function useAdmin() {
    const unsubscribeFromTickets = ref(() => {})
    const unsubscribeFromClosedTickets = ref(() => {})
    const unsubscribeVerifyRequests = ref(() => {})
    const tickets = ref([])
    const closedTickets = ref([])
    const verifyRequests = ref(() => {})

    function getTickets() {
        try {
            const queryData = query(dbTicketsRef, where('type', 'in', ['Help/Support', 'Trust and Safety', 'Bug report', 'Other']),
            where('open', '==', true), orderBy('type'), orderBy('createdAt'))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                tickets.value = []
                docs.forEach((doc) => {
                    const ticket = {
                        id: doc.id,
                        ...doc.data()
                    }
                    tickets.value.push(ticket)
                })
            })
            unsubscribeFromTickets.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    function getClosedTickets() {
        try {
            const queryData = query(dbTicketsRef, where('type', 'in', ['Help/Support', 'Trust and Safety', 'Bug report', 'Other']),
            where('open', '==', false), orderBy('type'), orderBy('createdAt'))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                closedTickets.value = []
                docs.forEach((doc) => {
                    const ticket = {
                        id: doc.id,
                        ...doc.data()
                    }
                    closedTickets.value.push(ticket)
                })
            })
            unsubscribeFromClosedTickets.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    function getVerifyRequests() {
        try {
            const queryData = query(dbTicketsRef, where('type', '==', 'Verification request'), orderBy('createdAt'))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                verifyRequests.value = []
                docs.forEach((doc) => {
                    const ticket = {
                        id: doc.id,
                        ...doc.data()
                    }
                    verifyRequests.value.push(ticket)
                })
            })
            unsubscribeVerifyRequests.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function rejectVerify(id) {
        try {
            const ticket = doc(dbTicketsRef, id)
            await deleteDoc(ticket)
        } catch(e) {
            console.error(e)
        }
    }

    async function verify(username, id) {
        try {
            const queryUser = query(dbUsersRef, where('username', '==', username))
            const user = await getDocs(queryUser)
            user.docs.forEach((document) => {
                updateDoc(doc(db, "users", document.id), {
                    verified: true
                })
            })

            // change posts
            const queryData = query(dbPostsRef, where('username', '==', username))
            const posts = await getDocs(queryData)
            posts.docs.forEach((document) => {
                updateDoc(doc(db, "posts", document.id), {
                    verified: true
                })
            })

            // change comments
            const queryData2 = query(dbCommentsRef, where('username', '==', username))
            const comments = await getDocs(queryData2)
            comments.docs.forEach((document) => {
                updateDoc(doc(db, "comments", document.id), {
                    verified: true
                })
            })

            if (id) {
                rejectVerify(id)
            }
        } catch(e) {
            console.error(e)
        }
    }

    async function addAdmin(username) {
        try {
            const queryUser = query(dbUsersRef, where('username', '==', username))
            const user = await getDocs(queryUser)
            user.docs.forEach((document) => {
                updateDoc(doc(db, "users", document.id), {
                    admin: true
                })
            })
            verify(username)
        } catch(e) {
            console.error(e)
        }
    }

    async function removeAdmin(username) {
        try {
            const queryUser = query(dbUsersRef, where('username', '==', username))
            const user = await getDocs(queryUser)
            user.docs.forEach((document) => {
                updateDoc(doc(db, "users", document.id), {
                    admin: false
                })
            })
        } catch(e) {
            console.error(e)
        }
    }

    async function unverify(username) {
        try {
            const queryUser = query(dbUsersRef, where('username', '==', username))
            const user = await getDocs(queryUser)
            user.docs.forEach((document) => {
                updateDoc(doc(db, "users", document.id), {
                    verified: false
                })
            })

            // change posts
            const queryData = query(dbPostsRef, where('username', '==', username))
            const posts = await getDocs(queryData)
            posts.docs.forEach((document) => {
                updateDoc(doc(db, "posts", document.id), {
                    verified: false
                })
            })

            // change comments
            const queryData2 = query(dbCommentsRef, where('username', '==', username))
            const comments = await getDocs(queryData2)
            comments.docs.forEach((document) => {
                updateDoc(doc(db, "comments", document.id), {
                    verified: false
                })
            })
        } catch(e) {
            console.error(e)
        }
    }

    onMounted(() => {
        getTickets()
        getClosedTickets()
        getVerifyRequests()
    })

    onUnmounted(() => {
        unsubscribeFromTickets.value()
        unsubscribeFromClosedTickets.value()
        unsubscribeVerifyRequests.value()
    })

    return {
        tickets,
        closedTickets,
        verifyRequests,
        verify,
        rejectVerify,
        unverify,
        addAdmin,
        removeAdmin
    }
}