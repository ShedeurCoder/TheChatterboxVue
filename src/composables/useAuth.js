import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, deleteUser, sendPasswordResetEmail, updatePassword, updateEmail } from 'firebase/auth'
import { ref } from 'vue'
import { doc, setDoc, query, where, getDocs, onSnapshot, orderBy, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, dbUsersRef, dbNotifsRef, dbMessageNotifsRef, dbPostsRef, dbCommentsRef, dbMessagesRef } from '../firebase'

export default function useAuth() {
    const auth = getAuth()
    const errorMessage = ref('')
    const userData = ref(null)
    const unsubscribeFromUser = ref(() => {})
    const readNotifs = ref([])
    const unreadNotifs = ref([])
    const chatNotifs = ref([])
    const unsubscribeFromReadNotifs = ref(() => {})
    const unsubscribeFromUnreadNotifs = ref(() => {})
    const unsubscribeFromChatNotifs = ref(() => {})
    const notifsNumber = ref(0)

    function getNotifs(username) {
        try {
            const unreadQueryData = query(dbNotifsRef, where('to', '==', username), where('read', '==', false), orderBy('createdAt'))
            const unread = onSnapshot(unreadQueryData, (docs) => {
                unreadNotifs.value = []
                docs.forEach((doc) => {
                    const notif = {
                        id: doc.id,
                        ...doc.data()
                    }
                    unreadNotifs.value.push(notif)
                })
                unreadNotifs.value.reverse()
                notifsNumber.value = unreadNotifs.value.length + chatNotifs.value.length
            })
            unsubscribeFromUnreadNotifs.value = unread

            const readQueryData = query(dbNotifsRef, where('to', '==', username), where('read', '==', true), orderBy('createdAt'))
            const read = onSnapshot(readQueryData, (docs) => {
                readNotifs.value = []
                docs.forEach((doc) => {
                    const notif = {
                        id: doc.id,
                        ...doc.data()
                    }
                    readNotifs.value.push(notif)
                })
                readNotifs.value.reverse()
            })
            unsubscribeFromReadNotifs.value = read
        } catch(err) {
            console.error(err)
        }
    }

    async function getChatNotifs(username) {
        try {
            const queryData = query(dbMessageNotifsRef, where('to', '==', username))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                chatNotifs.value = []
                docs.forEach(async (document) => {
                    const notif = {
                        id: document.id,
                        ...document.data()
                    }
                    chatNotifs.value.push(notif)
                })
                notifsNumber.value = unreadNotifs.value.length + chatNotifs.value.length
            })
            unsubscribeFromChatNotifs.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function readNotif(id) {
        try {
            await updateDoc(doc(db, "notifs", id), {
                read: true
            })
        } catch(err) {
            console.error(err)
        }
    }

    async function deleteNotif(id) {
        try {
            const notif = doc(dbNotifsRef, id)
            await deleteDoc(notif)
        } catch(err) {
            console.error(err)
        }
    }

    async function deleteAllNotifs(username) {
        try {
            const queryData = query(dbNotifsRef, where('to', '==', username))
            const notifs = await getDocs(queryData)
            notifs.docs.forEach(async (document) => {
                await deleteDoc(doc(dbNotifsRef, document.id))
            })
        } catch(err) {
            console.error(error)
        }
    }

    async function checkUserExists(username) {
        try {
            const queryData = query(dbUsersRef, where('username', '==', username))
            const user = getDocs(queryData)
            if (user.docs[0]) {
                return 'Username already taken'
            } else {
                return false
            }
        } catch(e) {
            console.error(e)
        }
    }

    function findUser(email) {
        try {
            const queryData = query(dbUsersRef, where('email', '==', email))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                docs.forEach((doc) => {
                    const user = {
                        id: doc.id,
                        ...doc.data(),
                        readNotifs: readNotifs.value,
                        unreadNotifs: unreadNotifs.value
                    }
                    userData.value = user
                    getNotifs(doc.data().username)
                    getChatNotifs(doc.data().username)
                })
            })
            unsubscribeFromUser.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function signUp(email, password, username) {
        try {
            const usernameTaken = await checkUserExists(username)
            if (usernameTaken) {
                errorMessage.value = 'Username already taken'
                return
            }

            if (!username) {
                errorMessage.value = 'Enter a username'
                return
            }

            const { user } = await createUserWithEmailAndPassword(auth, email, password)

            const userObject = {
                createdAt: new Date(),
                email: user.email,
                username: username,
                bio: '',
                displayName: username,
                url: '',
                pfp: 'defaultProfile_u6mqts',
                verified: false,
                followers: [],
                following: [],
                admin: false,
                saves: [],
                bg: '#303030',
                color: 'f1f1f1',
                secondaryBg: '#343a40',
                tcblink: false
            }

            const newDoc = doc(db, "users", user.uid)
            await setDoc(newDoc, userObject)

            errorMessage.value = ''
        } catch(e) {
            switch(e.code) {
                case 'auth/email-already-in-use':
                    errorMessage.value = 'User with that email already exists.'
                    break
                case 'auth/weak-password':
                    errorMessage.value = 'Password must be at least 6 characters long.'
                    break
                default: 
                    errorMessage.value = `Unexpected error creating user!\nError code: ${e.code}`
            }
        }
    }

    async function login(email, password) {
        if (!email) return errorMessage.value = 'Please enter a valid email'
        if (!password) return errorMessage.value = 'Please enter a valid password'
        try {
            await signInWithEmailAndPassword(auth, email, password)
            errorMessage.value = ''
        } catch(e) {
            switch(e.code) {
                case 'auth/wrong-password':
                    errorMessage.value = 'Incorrect password'
                    break
                case 'auth/user-not-found':
                    errorMessage.value = 'No user found with that email'
                    break
                default: 
                    errorMessage.value = `Unexpected error logging in!\nError code: ${e.code}`
            }
        }
    }

    async function logOut() {
        try {
            await signOut(auth)
            unsubscribeFromReadNotifs.value()
            unsubscribeFromUnreadNotifs.value()
            unsubscribeFromChatNotifs.value()
            notifsNumber.value = 0
        } catch(e) {
            errorMessage.value = e.message
        }
    }

    async function pinPost(post, user) {
        try {
            await updateDoc(doc(db, "users", user.id), {
                pinned: post.id
            })
        } catch(e) {
            console.error(e)
        }
    }

    async function unpinPost(user) {
        try {
            await updateDoc(doc(db, 'users', user.id), {
                pinned: null
            })
        } catch(e) {
            console.error(e)
        }
    }

    async function closeDm(user) {
        try {
            await updateDoc(doc(db, 'users', user.id), {
                dm: false
            })
        } catch(e) {
            console.error(e)
        }
    }

    async function openDm(user) {
        try {
            await updateDoc(doc(db, 'users', user.id), {
                dm: true
            })
        } catch(e) {
            console.error(e)
        }
    }

    async function forgor(email) {
        try {
            errorMessage.value = ''
            await sendPasswordResetEmail(auth, email)
            errorMessage.value = 'Sent email!'
        } catch(e) {
            errorMessage.value = e
            console.error(e)
        }
    }

    async function changeEmail(email) {
        try {
            errorMessage.value = ''
            await updateEmail(auth.currentUser, email)
            await updateDoc(doc(dbUsersRef, auth.currentUser.uid), {
                email: email
            })
            errorMessage.value = 'Change successful!'
        } catch(e) {
            if (e == 'FirebaseError: Firebase: Error (auth/requires-recent-login).') {
                errorMessage.value = 'Please log out, log back in, and try again.'
            } else {
                errorMessage.value = e
            }
            console.error(e)
        }
    }

    async function changePassword(oldPassword, newPassword) {
        try {
            errorMessage.value = ''
            await signInWithEmailAndPassword(auth, auth.currentUser.email, oldPassword)
            await updatePassword(auth.currentUser, newPassword)
            errorMessage.value = 'Change successful!'
        } catch(e) {
            if (e == 'auth/wrong-password') {
                errorMessage.value = 'Incorrect password'
            } else {
                errorMessage.value = e
            }
            console.error(e)
        }
    }

    async function deleteAccount(password, username) {
        try {
            errorMessage.value = ''
            await signInWithEmailAndPassword(auth, auth.currentUser.email, password)
            const id = auth.currentUser.uid
            await deleteUser(auth.currentUser)

            await deleteDoc(doc(db, "users", id));

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

            errorMessage.value = 'Successfully deleted account'
        } catch(e) {
            if (e == 'auth/wrong-password') {
                errorMessage.value = 'Incorrect password'
            } else {
                errorMessage.value = e
            }
            console.error(e)
        }
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            try {
                findUser(user.email)
            } catch(e) {
                console.error(e)
            }
        } else {
            unsubscribeFromUser.value()
            unsubscribeFromReadNotifs.value()
            unsubscribeFromUnreadNotifs.value()
            unsubscribeFromChatNotifs.value()

            userData.value = null
            readNotifs.value = []
            unreadNotifs.value = []
            notifsNumber.value = 0
        }
    })
    return {
        signUp, errorMessage, login, logOut, userData, readNotifs, unreadNotifs, readNotif, deleteNotif,
        pinPost,
        unpinPost,
        chatNotifs,
        closeDm,
        openDm,
        forgor,
        changePassword,
        changeEmail,
        deleteAccount,
        deleteAllNotifs,
        notifsNumber
    }
}