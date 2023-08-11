import { ref, onUnmounted } from 'vue'
import { onSnapshot, query, where, orderBy, getDocs } from 'firebase/firestore'
import { dbPostsRef, dbUsersRef } from '../firebase'

export default function useProfile() {
    const posts = ref(null)
    const searchResult = ref([])
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

    async function queryUser(search) {
        const queryData = query(dbUsersRef, where('username', '>=', search), where('username', '<=', search + '\uf8ff'))
        const queryResult = await getDocs(queryData)
        searchResult.value = []
        queryResult.docs.forEach((document) => {
            searchResult.value.push(document.data())
        })
    }

    onUnmounted(() => {
        unsubscribeFromPosts.value()
    })

    return {
        posts,
        getPosts,
        queryUser,
        searchResult
    }
}