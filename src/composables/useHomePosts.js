import { ref, onUnmounted } from 'vue'
import { onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { dbPostsRef } from '../firebase'

export default function useProfile() {
    const posts = ref(null)
    const unsubscribeFromPosts = ref(() => {})

    async function getPosts(following) {
        try {
            const queryData = query(dbPostsRef, where('username', 'in', following), orderBy('createdAt'))
            const unsubscribeFromPosts = onSnapshot(queryData, (docs) => {
                posts.value = []
                docs.forEach((doc) => {
                    const post = {
                        id: doc.id,
                        ...doc.data()
                    }
                    posts.value.push(post)
                })
                posts.value.reverse()
            })
            unsubscribeFromPosts.value = unsubscribeFromPosts
        } catch(e) {
            console.error(e)
        }
    }

    onUnmounted(() => {
        unsubscribeFromPosts.value()
    })

    return {
        posts,
        getPosts
    }
}