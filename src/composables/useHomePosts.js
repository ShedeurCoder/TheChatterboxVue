import { ref, onUnmounted } from 'vue'
import { onSnapshot, query, where, orderBy, getDocs } from 'firebase/firestore'
import { dbPostsRef } from '../firebase'

export default function useProfile() {
    const posts = ref([])
    const unsubscribeFromPosts = ref(() => {})

    async function getPosts(following) {
        try {
            const queryData = query(dbPostsRef, where('username', 'in', following), orderBy('createdAt'))
            const unsubscribe = onSnapshot(queryData, (docs) => {
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
            unsubscribeFromPosts.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function explore() {
        try {
            const sampleSize = 50
            const postsDocs = await getDocs(query(dbPostsRef))
            const postsLength = postsDocs.docs.length
            
            // pick random indexes
            let indexes = []
            for (var i = 0; i < sampleSize;) {
                const rndInt = Math.floor(Math.random() * postsLength) + 1
                if (!indexes.includes(rndInt)) {
                    indexes.push(rndInt)
                    i++
                } else {
                    continue
                }
            }

            // get post values
            let index = 0
            postsDocs.forEach((post) => {
                if (indexes.includes(index)) {
                    const postObj = {
                        id: post.id,
                        ...post.data()
                    }
                    posts.value.push(postObj)
                }
                index++
            })

            // shuffle array
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            shuffleArray(posts.value)
        } catch(e) {
            console.log(e)
        }
    }

    function removePosts() {
        posts.value = []
        unsubscribeFromPosts.value()
    }

    onUnmounted(() => {
        unsubscribeFromPosts.value()
    })

    return {
        posts,
        getPosts,
        removePosts,
        explore
    }
}