import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { ref } from 'vue'
import { doc, setDoc, query, where, getDocs, onSnapshot, orderBy, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, dbUsersRef, dbNotifsRef, dbMessageNotifsRef } from '../firebase'

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
                secondaryBg: '#343a40'
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

    function logOut() {
        try {
            signOut(auth)
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

    onAuthStateChanged(auth, (user) => {
        if (user) {
            findUser(user.email)
        } else {
            unsubscribeFromUser.value()
            unsubscribeFromReadNotifs.value()
            unsubscribeFromUnreadNotifs.value()
            unsubscribeFromChatNotifs.value()

            userData.value = null
            readNotifs.value = []
            unreadNotifs.value = []
        }
    })
    return {
        signUp, errorMessage, login, logOut, userData, readNotifs, unreadNotifs, readNotif, deleteNotif,
        pinPost,
        unpinPost,
        chatNotifs,
        closeDm,
        openDm
    }
}