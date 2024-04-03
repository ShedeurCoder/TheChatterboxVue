import { ref } from 'vue'
import { addDoc, updateDoc, doc, deleteDoc, query, getDocs, where, getDoc } from 'firebase/firestore'
import { dbPostsRef, db, dbCommentsRef, dbNotifsRef, dbUsersRef } from '../firebase'

export default function usePosts() {
    const atPattern = /(@)+[A-Za-z0-9_]{1,}/gim
    const hashtagPattern = /(#)+[A-Za-z0-9_]{1,}/gim
    const postMessage = ref('')
    const savedPosts = ref([])

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

    async function makePost(message, username, pfp, verified, image) {
        try {
            if (username) {
                let hashtags = []
                const hashtagMatches = message.match(hashtagPattern)
                if (hashtagMatches) {
                    hashtagMatches.forEach((tag) => {
                        if (!hashtags.includes(tag.toLowerCase().replace('#', ''))) {
                            hashtags.push(tag.toLowerCase().replace('#', ''))
                        }
                    })
                }

                const post = {
                    username,
                    verified: verified ?? false,
                    createdAt: new Date(),
                    message,
                    likes: [],
                    comments: 0,
                    pfp: pfp ?? 'defaultProfile_u6mqts',
                    pinned: null,
                    tags: hashtags,
                    image
                }
                const finalPost = await addDoc(dbPostsRef, post)
                postMessage.value = 'Sent!'

                const matches = message.match(atPattern)
                if (matches) {
                    let matched = []
                    for (var i = 0; i < matches.length; i++) {
                        if (matches[i].replace('@', '') !== username && checkUserExists(matches[i].replace('@', '')) && !matched.includes(matches[i].replace('@', ''))) {
                            await createNotif(matches[i].replace('@', ''), username, `/post/${finalPost.id}`, `@${username} mentioned you in their post!`)
                            matched.push(matches[i].replace('@', ''))
                        }
                    }
                }

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
            // unsave
            const queryUsers = query(dbUsersRef, where('saves', 'array-contains', id))
            const users = await getDocs(queryUsers)
            users.docs.forEach(async document => {
                await updateDoc(doc(db, 'users', document.id), {
                    saves: document.data().saves.filter((post) => post != id)
                })
            })

            // delete comments
            const queryData = query(dbCommentsRef, where('postId', '==', id))
            const comments = await getDocs(queryData)
            comments.forEach(async (document) => {
                const comment = doc(dbCommentsRef, document.id)
                await deleteDoc(comment)
            })

            // set quotes to "post deleted"
            const quotePostsQuery = query(dbPostsRef, where('quoted', '==', id))
            const quotePosts = await getDocs(quotePostsQuery)
            quotePosts.forEach(async (document) => {
                await updateDoc(doc(dbPostsRef, document.id), {
                    quotedMessage: 'Post was deleted',
                    quotedUsername: '',
                    quotedPfp: 'defaultProfile_u6mqts',
                    quoted: 'undefined'
                })
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

    async function quote(quoted, message, user) {
        try {
            const post = {
                username: user.username,
                verified: user.verified ?? false,
                createdAt: new Date(),
                message,
                likes: [],
                comments: 0,
                pfp: user.pfp ?? 'defaultProfile_u6mqts',
                pinned: null,
                
                quoted: quoted.id,
                quotedUsername: quoted.username,
                quotedPfp: quoted.pfp,
                quotedMessage: quoted.message
            }
            const finalPost = await addDoc(dbPostsRef, post)
            const matches = message.match(atPattern)

            if (quoted.username !== user.username) {
                await createNotif(quoted.username, user.username, `/post/${finalPost.id}`, `@${user.username} quoted your post!`)
            }

            if (matches) {
                for (var i = 0; i < matches.length; i++) {
                    if (matches[i].replace('@', '') !== user.username && checkUserExists(matches[i].replace('@', ''))) {
                        await createNotif(matches[i].replace('@', ''), user.username, `/post/${finalPost.id}`, `@${user.username} mentioned you in their post!`)
                    }
                }
            }
        } catch(e) {
            console.error(e)
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
        savedPosts,
        likeComment,
        unlikeComment,
        quote
    }
}