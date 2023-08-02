import { ref } from 'vue'
import { addDoc, updateDoc, doc, deleteDoc, query, getDocs, where } from 'firebase/firestore'
import { dbPostsRef, db, dbCommentsRef } from '../firebase'

export default function usePosts() {
    const postMessage = ref('')

    async function makePost(message, username) {
        try {
            if (username) {
                const post = {
                    username,
                    createdAt: new Date(),
                    message,
                    likes: []
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

    return {
        makePost,
        postMessage,
        likePost,
        unlike,
        deletePost
    }
}