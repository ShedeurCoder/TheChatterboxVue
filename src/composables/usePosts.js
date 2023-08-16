import { ref } from 'vue'
import { addDoc, updateDoc, doc, deleteDoc, query, getDocs, where, getDoc } from 'firebase/firestore'
import { dbPostsRef, db, dbCommentsRef, dbNotifsRef, dbUsersRef } from '../firebase'

export default function usePosts() {
    const postMessage = ref('')
    const savedPosts = ref([])

    async function createNotif(to, from, url, message) {
        try {
            const notif = {
                to,
                from,
                url,
                message,
                createdAt: new Date(),
                read: false
            }
            await addDoc(dbNotifsRef, notif)
        } catch(e) {
            console.error(e)
        }
    }

    async function makePost(message, username, pfp, verified) {
        try {
            if (username) {
                const post = {
                    username,
                    verified: verified ?? false,
                    createdAt: new Date(),
                    message,
                    likes: [],
                    comments: 0,
                    pfp: pfp ?? 'defaultProfile_u6mqts'
                }
                await addDoc(dbPostsRef, post)
                postMessage.value = 'Sent!'
            } else {
                postMessage.value = 'Sign in to make a post'
            }
        } catch(e) {
            postMessage.value = 'There was an error making the post. Please try again later'
            console.error(e)
        }
    }

    async function likePost(post, username) {
        try {
            await updateDoc(doc(db, "posts", post.id), {
                likes: [...post.likes, username]
            });
            if (post.username !== username) {
                await createNotif(post.username, username, `/post/${post.id}`, `${username} liked your post!`)
            }
        } catch(e) {
            console.error(e)
        }
    }

    async function unlike(post, username) {
        try {
            await updateDoc(doc(db, "posts", post.id), {
                likes: post.likes.filter((ar)=> ar != username)
            });
        } catch(e) {
            console.error(e)
        }
    }

    async function deletePost(id) {
        try {   
            const queryUsers = query(dbUsersRef, where('saves', 'array-contains', id))
            const users = await getDocs(queryUsers)
            users.docs.forEach(async document => {
                await updateDoc(doc(db, 'users', document.id), {
                    saves: document.data().saves.filter((post) => post != id)
                })
            })

            const queryData = query(dbCommentsRef, where('postId', '==', id))
            const comments = await getDocs(queryData)
            comments.forEach(async (document) => {
                const comment = doc(dbCommentsRef, document.id)
                await deleteDoc(comment)
            })
            const post = doc(dbPostsRef, id)
            await deleteDoc(post)
        } catch(e) {
            console.error(e)
        }
    }

    async function save(id, user) {
        try {
            await updateDoc(doc(db, 'users', user.id), {
                saves: [...(user?.saves ?? []), id]
            })
        } catch(err) {
            console.error(err)
        }
    }

    async function unsave(id, user) {
        try {
            await updateDoc(doc(db, 'users', user.id), {
                saves: user.saves.filter((s) => s != id)
            })
        } catch(err) {
            console.error(err)
        }
    }

    async function getSaves(saves) {
        try {
            saves.forEach(async id => {
                const post = await getDoc(doc(db, 'posts', id))
                const postObj = {
                    id: post.id,
                    ...post.data()
                }
                savedPosts.value = [postObj, ...savedPosts.value]
            })
        } catch(err) {
            console.error(err)
        }
    }

    return {
        makePost,
        postMessage,
        likePost,
        unlike,
        deletePost,
        unsave,
        save,
        getSaves,
        savedPosts
    }
}