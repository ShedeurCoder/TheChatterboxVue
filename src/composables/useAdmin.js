import { ref, onUnmounted, onMounted } from 'vue'
import { query, orderBy, where, onSnapshot, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { dbTicketsRef, dbPostsRef, dbCommentsRef, dbUsersRef, db, dbMessagesRef } from '../firebase'

export default function useAdmin() {
    const unsubscribeFromTickets = ref(() => {})
    const unsubscribeFromClosedTickets = ref(() => {})
    const unsubscribeVerifyRequests = ref(() => {})
    const tickets = ref([])
    const closedTickets = ref([])
    const verifyRequests = ref(() => {})

    async function deleteUser(username) {
        try {
            const userQuery = query(dbUsersRef, where('username', '==', username))
            const user = await getDocs(userQuery)

            if (user.docs[0]) {
                if (user.docs[0].data().admin === true) {
                    alert('user is an admin. you cannot delete them')
                    return
                }
                await deleteDoc(doc(db, "users", user.docs[0].id))
            } else {
                alert('user not found')
                return
            }


            // change posts to Deleted user
            const queryData = query(dbPostsRef, where('username', '==', username))
            const posts = await getDocs(queryData)
            posts.docs.forEach(async (document) => {

                // set quotes to "post deleted"
                const quotePostsQuery = query(dbPostsRef, where('quoted', '==', document.id))
                const quotePosts = await getDocs(quotePostsQuery)
                quotePosts.forEach(async (document) => {
                    await updateDoc(doc(dbPostsRef, document.id), {
                        quotedUsername: 'deleted user',
                        quotedPfp: 'defaultProfile_u6mqts',
                    })
                })

                await updateDoc(doc(db, 'posts', document.id), {
                    username: 'deleted user',
                    pfp: 'defaultProfile_u6mqts',
                    verified: false
                })
            })

            // change comments
            const queryData2 = query(dbCommentsRef, where('username', '==', username))
            const comments = await getDocs(queryData2)
            comments.docs.forEach((document) => {
                updateDoc(doc(db, 'comments', document.id), {
                    username: 'deleted user',
                    pfp: 'defaultProfile_u6mqts',
                    verified: false
                })
            })

            // change replies
            const queryData3 = query(dbCommentsRef, where('repliesUsers', 'array-contains', username))
            const commentsWithReplies = await getDocs(queryData3)
            commentsWithReplies.docs.forEach((document) => {
                let finalReplies = []
                document.data().replies.forEach(reply => {
                    if (reply.username !== username) {
                        finalReplies = [...finalReplies, reply]
                    } else {
                        finalReplies = [...finalReplies, {
                            username: 'deleted user',
                            verified: false,
                            message: reply.message,
                            id: reply.id,
                            createdAt: reply.createdAt,
                            pfp: 'defaultProfile_u6mqts'
                        }]
                    }
                })
                updateDoc(doc(db, "comments", document.id), {
                    replies: finalReplies,
                    repliesUsers: document.data().repliesUsers.filter((u) => u != username)
                })
            })

            // change messages
            const queryData4 = query(dbMessagesRef, where('user', '==', username))
            const messages = await getDocs(queryData4)
            messages.docs.forEach((document) => {
                updateDoc(doc(dbMessagesRef, document.id), {
                    username: 'deleted user',
                    pfp: 'defaultProfile_u6mqts'
                })
            })

            // remove comment likes
            const queryData5 = query(dbCommentsRef, where('likes', 'array-contains', username))
            const likedComments = await getDocs(queryData5)
            likedComments.docs.forEach((document) => {
                updateDoc(doc(db, "comments", document.id), {
                    likes: document.data().likes.filter((u) => u != username)
                })
            })

            // remove post likes
            const queryData6 = query(dbPostsRef, where('likes', 'array-contains', username))
            const likedPosts = await getDocs(queryData6)
            likedPosts.docs.forEach((document) => {
                updateDoc(doc(db, "comments", document.id), {
                    likes: document.data().likes.filter((u) => u != username)
                })
            })

            // remove following
            const queryData7 = query(dbUsersRef, where('followers', 'array-contains', username))
            const following = await getDocs(queryData7)
            following.docs.forEach((document) => {
                updateDoc(doc(dbUsersRef, document.id), {
                    likes: document.data().followers.filter((u) => u != username)
                })
            }) 

            // remove followers
            const queryData8 = query(dbUsersRef, where('following', 'array-contains', username))
            const followers = await getDocs(queryData8)
            followers.docs.forEach((document) => {
                updateDoc(doc(dbUsersRef, document.id), {
                    likes: document.data().following.filter((u) => u != username)
                })
            })
        } catch(e) {
            console.error(e)
        }
    }

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

            // change replies
            const queryData3 = query(dbCommentsRef, where('repliesUsers', 'array-contains', username))
            const commentsWithReplies = await getDocs(queryData3)
            commentsWithReplies.docs.forEach((document) => {
                let finalReplies = []
                document.data().replies.forEach(reply => {
                    if (reply.username === username) {
                        finalReplies = [...finalReplies, {
                            username: reply.username,
                            verified: true,
                            message: reply.message,
                            id: reply.id,
                            createdAt: reply.createdAt,
                            pfp: reply.pfp
                        }]
                    } else {
                        finalReplies = [...finalReplies, reply]
                    }
                })
                updateDoc(doc(db, "comments", document.id), {
                    replies: finalReplies
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

            // change replies
            const queryData3 = query(dbCommentsRef, where('repliesUsers', 'array-contains', username))
            const commentsWithReplies = await getDocs(queryData3)
            commentsWithReplies.docs.forEach((document) => {
                let finalReplies = []
                document.data().replies.forEach(reply => {
                    if (reply.username === username) {
                        finalReplies = [...finalReplies, {
                            username: reply.username,
                            verified: false,
                            message: reply.message,
                            id: reply.id,
                            createdAt: reply.createdAt,
                            pfp: reply.pfp
                        }]
                    } else {
                        finalReplies = [...finalReplies, reply]
                    }
                })
                updateDoc(doc(db, "comments", document.id), {
                    replies: finalReplies
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
        removeAdmin,
        deleteUser
    }
}