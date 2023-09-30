import { useRouter, onBeforeRouteUpdate, useRoute } from 'vue-router'
import { onSnapshot, query, where, orderBy, getDocs } from 'firebase/firestore'
import { dbUsersRef, dbPostsRef } from '../firebase'
import { ref } from 'vue'

export default function useSearch() {
    const route = useRoute()
    const router = useRouter()
    const usersResult = ref([])
    const postsResult = ref([])
    const unsubscribe = ref(() => {})

    async function queryBoth() {
        await queryUser(route.query.q.toLowerCase(), 1)
        queryPosts(route.query.q.toLowerCase())
    }

    async function queryUser(search, event) {
        if (event.keyCode == 13) {
            router.push({ path: '/search', query: { q: search } })
        }
        const queryData = query(dbUsersRef, where('username', '>=', search), where('username', '<=', search + '\uf8ff'))
        const queryResult = await getDocs(queryData)
        usersResult.value = []
        queryResult.docs.forEach((document) => {
            usersResult.value.push(document.data())
        })
    }

    function queryPosts(search) {
        const queryData = query(dbPostsRef, where('tags', 'array-contains', search), orderBy('createdAt', 'desc'))
        const unsub = onSnapshot(queryData, (docs) => {
            postsResult.value = []
            docs.forEach((doc) => {
                const post = {
                    id: doc.id,
                    ...doc.data()
                }
                postsResult.value.push(post)
            })
        })
        unsubscribe.value = unsub
    }

    return {
        queryUser,
        usersResult,
        postsResult,
        queryBoth,
        unsubscribe
    }
}