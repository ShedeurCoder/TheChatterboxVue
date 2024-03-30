import { ref, onUnmounted } from 'vue'
import { db, dbUsersRef, dbTreesRef } from '../firebase'
import { query, where, orderBy, onSnapshot, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export default function useLink() {
    const tree = ref({})
    const userTree = ref({})
    const unsubscribeFromTree = ref(() => {})
    const unsubscribeFromUserTree = ref(() => {})

    async function createTree(username, userId, pfp) {
        try {
            const tree = {
                username,
                links: [],
                pfp,
                bg: '#fff',
                color: '#000',
                desc: ''
            }
            await addDoc(dbTreesRef, tree)

            await updateDoc(doc(dbUsersRef, userId), {
                tcblink: true
            })
        } catch(e) {
            console.error(e)
        }
    }

    async function getUserTree(user) {
        try {
            const queryData = query(dbTreesRef, where('username', '==', user.username))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                docs.forEach((doc) => {
                    const treeData = {
                        id: doc.id,
                        ...doc.data()
                    }
                    tree.value = treeData
                })
            })
            unsubscribeFromTree.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function getTree(user) {
        try {
            const queryData = query(dbTreesRef, where('username', '==', user))
            const unsubscribe = onSnapshot(queryData, (docs) => {
                docs.forEach((doc) => {
                    const treeData = {
                        id: doc.id,
                        ...doc.data()
                    }
                    userTree.value = treeData
                })
            })
            unsubscribeFromUserTree.value = unsubscribe
        } catch(e) {
            console.error(e)
        }
    }

    async function addLink(link, tree) {
        await updateDoc(doc(dbTreesRef, tree.id), {
            links: [...tree.links, {
                title: link.title,
                url: link.url,
                bg: link.bg,
                color: link.color
            }]
        })
    }

    async function removeLink(index, tree) {
        let e = tree.links
        e.splice(index, 1)
        await updateDoc(doc(dbTreesRef, tree.id), {
            links: e
        })
    }

    async function moveUp(index, tree, links) {
        console.log(links)
        var b = links[index];
        links[index] = links[index - 1];
        links[index - 1] = b;
        await updateDoc(doc(dbTreesRef, tree.id), {
            links: links
        })
    }

    async function moveDown(index, tree, links) {
        var b = links[index];
        links[index] = links[index + 1];
        links[index + 1] = b;
        await updateDoc(doc(dbTreesRef, tree.id), {
            links: links
        })
    }

    async function editLink(data, tree, index) {
        try {
            let links = tree.links
            links[index] = data
            await updateDoc(doc(dbTreesRef, tree.id), {
                links: links
            })
        } catch(e) {
            console.error(e)
        }
    }

    async function editTreeSettings(data, id) {
        try {
            await updateDoc(doc(dbTreesRef, id), {
                bg: data.bg,
                color: data.color,
                desc: data.desc
            })
        } catch(e) {
            console.error(e)
        }
    }

    onUnmounted(() => {
        unsubscribeFromTree.value()
        unsubscribeFromUserTree.value()
    })


    return {
        createTree,
        getUserTree,
        tree,
        addLink,
        removeLink,
        moveUp,
        moveDown,
        editLink,
        editTreeSettings,
        getTree,
        userTree
    }
}