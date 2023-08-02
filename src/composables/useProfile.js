import { ref, onUnmounted, onMounted } from 'vue'
import { query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore'
import { db, dbUsersRef, dbPostsRef } from '../firebase'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

export default function useProfile() {
    const profileData = ref(null)
    const unsubscribeFromProfile = ref(() => {})
    const editMessage = ref('')
    const unsubscribeFromProfilePosts = ref(() => {})
    const profilePosts = ref([])
    const route = useRoute()
    const username = route.params.username

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

    async function getUserPosts(username) {
        try {
            const queryData = query(dbPostsRef, where('username', '==', username), orderBy('createdAt'))
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
        } catch(e) {
            console.error(e)
        }
    }

    async function editProfile(displayName, bio, id) {
        try {
            editMessage.value = ''
            await updateDoc(doc(db, "users", id), {
                bio: bio,
                displayName: displayName
            });
            editMessage.value = 'Updated!'
        } catch(e) {
            console.error(e)
            editMessage.value = 'Sorry, there was an error. Please try again later.'
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

    onUnmounted(() => {
        unsubscribeFromProfile.value()
        unsubscribeFromProfilePosts.value()
    })

    onMounted(() => {
        getUserPosts(username)
        getUserProfile(username)
    })

    onBeforeRouteUpdate((to) => {
        const username = to.params.username
        getUserPosts(username)
        getUserProfile(username)
    })

    return {
        profileData,
        follow,
        unfollow,
        editProfile,
        editMessage,
        profilePosts
    }
}