import { ref, onUnmounted, onMounted } from 'vue'
import { onSnapshot, doc, addDoc, query, where, orderBy, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { db, dbCommentsRef, dbNotifsRef, dbUsersRef } from '../firebase'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

export default function usePostPage() {
    const atPattern = /(@)+[A-Za-z0-9_]{1,}/gim
    const postData = ref(null)
    const unsubscribeFromPost = ref(() => {})
    const unsubscribeFromComments = ref(() => {})
    const comments = ref([])
    const route = useRoute()
    const postId = route.params.post
    const highlightedComment = ref(route.query.c)

    async function checkUserExists(username) {
        try {
            const queryData = query(dbUsersRef, where('username', '==', username))
            const user = await getDocs(queryData)
            if (user.docs[0]) {
                return true
            } else {
                return false
            }
        } catch(e) {
            console.error(e)
        }
    }

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

    async function createComment(message, username, postId, postComments, pfp, postUser, verified) {
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
                    pfp: pfp ?? 'defaultProfile_u6mqts',
                    verified: verified ?? false,
                    replies: [],
                    repliesUsers: []
                }
                const commentDoc = await addDoc(dbCommentsRef, comment)
                if (postUser !== username) {
                    await createNotif(postUser, username, `/post/${postId}?c=${commentDoc.id}`, `${username} commented on your post!`)
                }
                const matches = message.match(atPattern)
                if (matches) {
                    for (var i = 0; i < matches.length; i++) {
                        if (matches[i].replace('@', '') !== username && checkUserExists(matches[i].replace('@', ''))) {
                            await createNotif(matches[i].replace('@', ''), username, `/post/${postId}?c=${commentDoc.id}`, `@${username} mentioned you in their comment!`)
                        }
                    }
                }
            } else {
                return
            }
        } catch(e) {
            console.error(e)
        }
    }

    async function pin(comment, post, user) {
        try {
            await updateDoc(doc(db, "posts", post.id), {
                pinned: comment.id
            });
            if (comment.username !== user.username) {
                await createNotif(comment.username, user.username, `/post/${post.id}?c=${comment.id}`, `${user.username} pinned your comment!`)
            }
        } catch(e) {
            console.error(e)
        }
    }

    async function unpin(post) {
        try {
            await updateDoc(doc(db, "posts", post.id), {
                pinned: ''
            })
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
            if (comment.username !== username) {
                await createNotif(comment.username, username, `/post/${postId}?c=${comment.id}`, `${username} liked your comment!`)
            }
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

    async function makeReply(message, user, comment) {
        try {
            await updateDoc(doc(db, 'comments', comment.id), {
                replies: [...(comment.replies || []), {
                    id: comment.replies?.length > 0 ? comment.replies.reverse()[0].id + 1 : 0,
                    pfp: user.pfp ?? 'defaultProfile_u6mqts',
                    username: user.username,
                    verified: user.verified ?? false,
                    message,
                    createdAt: new Date()
                }]
            })

            if (!comment.repliesUsers?.includes(user.username)) {
                await updateDoc(doc(db, 'comments', comment.id), {
                    repliesUsers: [...(comment.repliesUsers || []), user.username]
                })
            }

            if (user.username !== comment.username) {
                await createNotif(comment.username, user.username, `/post/${comment.postId}?c=${comment.id}`, `${user.username} replied to your comment!`)
            }

            const matches = message.match(atPattern)
            if (matches) {
                for (var i = 0; i < matches.length; i++) {
                    if (matches[i].replace('@', '') !== user.username && checkUserExists(matches[i].replace('@', ''))) {
                        await createNotif(matches[i].replace('@', ''), user.username, `/post/${comment.postId}?c=${comment.id}`, `@${user.username} mentioned you in their reply!`)
                    }
                }
            }
        } catch(e) {
            console.error(e)
        }
    }

    async function deleteReply(id, comment, username) {
        try {
            if (comment.replies.filter((c) => c.username === username).length === 1) {
                await updateDoc(doc(db, 'comments', comment.id), {
                    repliesUsers: comment.repliesUsers.filter((u) => u != username)
                })
            }

            await updateDoc(doc(db, 'comments', comment.id), {
                replies: comment.replies.filter((c) => c.id !== id)
            })
        } catch(e) {
            console.error(e)
        }
    }

    onUnmounted(() => {
        unsubscribeFromPost.value()
        unsubscribeFromComments.value()
    })

    onMounted(() => {
        getPost(postId)
        getComments(postId)
    })

    onBeforeRouteUpdate((to) => {
        const postId = to.params.post
        highlightedComment.value = to.query.c
        unsubscribeFromPost.value()
        unsubscribeFromComments.value()
        getPost(postId)
        getComments(postId)
    })

    return {
        postData,
        createComment,
        comments,
        likeComment,
        unlikeComment,
        deleteComment,
        highlightedComment,
        makeReply,
        deleteReply,
        pin,
        unpin
    }
}