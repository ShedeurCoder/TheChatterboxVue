import { ref, onUnmounted, onMounted } from 'vue'
import { onSnapshot, doc, addDoc, query, where, orderBy, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, dbCommentsRef } from '../firebase'
import { useRoute } from 'vue-router'

export default function useProfile() {
    const postData = ref(null)
    const unsubscribeFromPost = ref(() => {})
    const unsubscribeFromComments = ref(() => {})
    const comments = ref([])
    const route = useRoute()
    const postId = route.params.post

    async function getPost(id) {
        try {
            const queryData = doc(db, "posts", id)
            const unsubscribe = onSnapshot(queryData, (doc) => {
                const post = {
                    id: doc.id,
                    ...doc.data()
                }
                postData.value = post
            })
            unsubscribeFromPost.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function createComment(message, username, postId, postComments, pfp) {
        try {
            if (username && postId) {
                await updateDoc(doc(db, "posts", postId), {
                    comments: (postComments || 0) + 1
                });
                const comment = {
                    username,
                    createdAt: new Date(),
                    message,
                    likes: [],
                    postId,
                    pfp
                }
                await addDoc(dbCommentsRef, comment)
            } else {
                return
            }
        } catch(e) {
            console.error(e)
        }
    }

    async function getComments(postId) {
        try {
            const queryData = query(dbCommentsRef, where('postId', '==', postId), orderBy('createdAt'))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                comments.value = []
                docs.forEach((doc) => {
                    const comment = {
                        id: doc.id,
                        ...doc.data()
                    }
                    comments.value.push(comment)
                })
                comments.value.reverse()
            })
            unsubscribeFromComments.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function likeComment(comment, username) {
        try {
            await updateDoc(doc(db, "comments", comment.id), {
                likes: [...comment.likes, username]
            });
        } catch(e) {
            console.error(e)
        }
    }

    async function unlikeComment(comment, username) {
        try {
            await updateDoc(doc(db, "comments", comment.id), {
                likes: comment.likes.filter((ar)=> ar != username)
            });
        } catch(e) {
            console.error(e)
        }
    }

    async function deleteComment(id, postId, postComments) {
        try {
            await updateDoc(doc(db, "posts", postId), {
                comments: postComments - 1
            });
            const comment = doc(dbCommentsRef, id)
            await deleteDoc(comment)
        } catch(e) {
            console.error(e)
        }
    }

    onUnmounted(() => {
        unsubscribeFromPost.value()
        unsubscribeFromComments.value()
    })

    onMounted(() => {
        getComments(postId)
        getPost(postId)
    })

    return {
        postData,
        createComment,
        comments,
        likeComment,
        unlikeComment,
        deleteComment
    }
}