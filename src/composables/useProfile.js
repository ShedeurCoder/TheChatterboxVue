import { ref, onUnmounted, onMounted } from 'vue'
import { query, where, onSnapshot, updateDoc, doc, orderBy, getDocs, addDoc, limitToLast } from 'firebase/firestore'
import { db, dbUsersRef, dbPostsRef, dbCommentsRef, dbNotifsRef, dbMessagesRef } from '../firebase'
import { useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'

export default function useProfile() {
    const profileData = ref(null)
    const unsubscribeFromProfile = ref(() => {})
    const editMessage = ref('')
    const unsubscribeFromProfilePosts = ref(() => {})
    const profilePosts = ref([])
    const route = useRoute()
    let username = route.params.username
    let path = route.path

    async function getUserProfile(username) {
        try {
            const queryData = query(dbUsersRef, where('username', '==', username))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                docs.forEach((doc) => {
                    const user = {
                        id: doc.id,
                        ...doc.data()
                    }
                    profileData.value = user
                })
            })
            unsubscribeFromProfile.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function getUserPosts(username, limit) {
        try {
            let queryData
            if (path.includes('/likes')) {
                queryData = query(dbPostsRef, where('likes', 'array-contains', username), orderBy('createdAt'), limitToLast(limit))
            } else if (path.includes('/comments')) {
                queryData = query(dbCommentsRef, where('username', '==', username), orderBy('createdAt'), limitToLast(limit))
            } else {
                queryData = query(dbPostsRef, where('username', '==', username), orderBy('createdAt'), limitToLast(limit))
            }
            const unsubscribeFromPosts = onSnapshot(queryData, (docs) => {
                profilePosts.value = []
                docs.forEach((doc) => {
                    const post = {
                        id: doc.id,
                        ...doc.data()
                    }
                    profilePosts.value.push(post)
                })
                profilePosts.value.reverse()
            })
            unsubscribeFromProfilePosts.value = unsubscribeFromPosts
        } catch(e) {
            console.error(e)
        }
    }

    async function follow(following, user) {
        try {
            await updateDoc(doc(db, "users", following.id), {
                followers: [...following.followers, user.username]
            });

            await updateDoc(doc(db, "users", user.id), {
                following: [...user.following, following.username]
            });
            
            const notif = {
                to: following.username,
                from: user.username,
                url: `/@${user.username}`,
                message: `@${user.username} just followed you!`,
                createdAt: new Date(),
                read: false
            }
            await addDoc(dbNotifsRef, notif)
        } catch(e) {
            console.error(e)
        }
    }

    async function editProfile(inputs, id) {
        try {
            editMessage.value = ''
            await updateDoc(doc(db, "users", id), {
                bio: inputs.bio ?? '',
                displayName: inputs.displayName ?? '',
                url: inputs.url ?? '',
                color: inputs.color,
                bg: inputs.bg,
                secondaryBg: inputs.secondaryBg
            });
            editMessage.value = 'Updated!'
        } catch(e) {
            console.error(e)
            editMessage.value = 'Sorry, there was an error. Please try again later.'
        }
    }

    async function editPfp(id, public_id, username) {
        try {
            await updateDoc(doc(db, "users", id), {
                pfp: public_id
            });

            // change posts
            const queryData = query(dbPostsRef, where('username', '==', username))
            const posts = await getDocs(queryData)
            posts.docs.forEach(async (document) => {
                // set quotes to "post deleted"
                const quotePostsQuery = query(dbPostsRef, where('quoted', '==', document.id))
                const quotePosts = await getDocs(quotePostsQuery)
                quotePosts.forEach(async (document) => {
                    await updateDoc(doc(dbPostsRef, document.id), {
                        quotedPfp: 'public_id'
                    })
                })

                await updateDoc(doc(db, "posts", document.id), {
                    pfp: public_id
                })
            })

            // change comments
            const queryData2 = query(dbCommentsRef, where('username', '==', username))
            const comments = await getDocs(queryData2)
            comments.docs.forEach((document) => {
                updateDoc(doc(db, "comments", document.id), {
                    pfp: public_id
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
                            verified: reply.verified,
                            message: reply.message,
                            id: reply.id,
                            createdAt: reply.createdAt,
                            pfp: public_id
                        }]
                    } else {
                        finalReplies = [...finalReplies, reply]
                    }
                })
                updateDoc(doc(db, "comments", document.id), {
                    replies: finalReplies
                })
            })

            // change messages
            const queryData4 = query(dbMessagesRef, where('user', '==', username))
            const messages = await getDocs(queryData4)
            messages.docs.forEach((document) => {
                updateDoc(doc(dbMessagesRef, document.id), {
                    pfp: public_id
                })
            })
        } catch(e) {
            console.error(e)
        }
    }

    async function unfollow(following, user) {
        try {
            await updateDoc(doc(db, "users", following.id), {
                followers: following.followers.filter((ar)=> ar != user.username)
            });
    
            await updateDoc(doc(db, "users", user.id), {
                following: user.following.filter((ar)=> ar != following.username)
            });
        } catch(e) {
            console.error(e)
        }
    }

    function updateAmount(amount) {
        getUserPosts(username, amount)
    }

    onUnmounted(() => {
        unsubscribeFromProfile.value()
        unsubscribeFromProfilePosts.value()
    })

    onMounted(() => {
        getUserProfile(username)
        getUserPosts(username, 50)
    })

    onBeforeRouteUpdate((to) => {
        username = to.params.username
        unsubscribeFromProfile.value()
        unsubscribeFromProfilePosts.value()
        getUserPosts(username)
        getUserProfile(username)
    })

    onBeforeRouteLeave((to) => {
        if (to.params.username) {
            if (to.params.username !== username) {
                username = to.params.username
                unsubscribeFromProfile.value()
                getUserProfile(username)
            }
            path = to.path
            unsubscribeFromProfilePosts.value()
            getUserPosts(to.params.username)
        }
    })

    return {
        profileData,
        follow,
        unfollow,
        editProfile,
        editMessage,
        profilePosts,
        editPfp,
        updateAmount
    }
}