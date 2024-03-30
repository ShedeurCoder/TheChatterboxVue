<script setup>
import { ref, onMounted } from 'vue'
import useLink from '@/composables/useLink'
const { getUserTree, tree, addLink, removeLink, moveUp, moveDown, editLink, editTreeSettings } = useLink()

const props = defineProps({
    user: Object
})

const newLinkData = ref({
    title: null,
    url: null,
    bg: '#000000',
    color: '#ffffff'
})

const editLinkData = ref({
    title: null,
    url: null,
    bg: null,
    color: null
})

const editTreeData = ref({
    bg: null,
    color: null,
    desc: null
})

const editLinkIndex = ref(null)

onMounted(() => {
    getUserTree(props.user)
})
</script>
<template>
    <div class="text-center">
        <button class="submit" onclick="document.getElementById('edit-tree-modal').showModal()">Edit tree</button>
    </div>
    <section>
        <div class="edit-links">
            <div class="link" v-for="(link, index) in tree.links" :style="`background: ${link.bg}; color: ${link.color}`">
                <div class="link-header">
                    <b class="link-title">{{ link.title }}</b><br>
                    <a :href="link.url" target="_blank"  :style="`color: ${link.color}`">{{ link.url }}</a>
                </div>
                <div class="buttons">
                    <button @click="editLinkData = link; editLinkIndex = index"
                    onclick="document.getElementById('edit-link-modal').showModal()"><i class="far fa-edit"></i></button>

                    <button v-if="index > 0" @click="moveUp(index, tree, tree.links)"><i class="fas fa-arrow-up"></i></button>

                    <button v-else disabled><i class="fas fa-arrow-up"></i></button>

                    <button v-if="index < (tree.links.length - 1)" @click="moveDown(index, tree, tree.links)"><i class="fas fa-arrow-down"></i></button>

                    <button v-else disabled><i class="fas fa-arrow-down"></i></button>

                    <button @click="removeLink(index, tree)"><i class="fas fa-trash"></i></button>
                </div>
            </div>

            <button class="add-link" onclick="document.getElementById('add-link-modal').showModal()">Add link</button>
        </div>

        <div class="preview">
            <iframe :src="`/t/${tree.username}`"></iframe>
        </div>
    </section>

    <dialog id='add-link-modal'>
        <div class="modal-header">
            <h2>Add Link</h2>
            <button class='close-modal' onclick="document.getElementById('add-link-modal').close()">&times;</button>
        </div>
        <div class="modal-body">
            <form class="sign-in-form" onsubmit="document.getElementById('add-link-modal').close()"
            @submit.prevent="addLink(newLinkData, tree); newLinkData.title = null; newLinkData.url = null;
            newLinkData.bg = '#000'; newLinkData.color = '#fff';">
                <div class="form-group">
                    <label for="title">Link title</label>
                    <input type="text" id="title" v-model="newLinkData.title" placeholder='Title' required>
                </div>
                <div class="form-group">
                    <label for="url">URL</label>
                    <input name="url" type='url' id="url" v-model="newLinkData.url" placeholder='Link'>
                </div>
                <hr>
                <div class="form-group">
                    <label for="bg">Link background</label>
                    <input type="color" name="bg" id="bg" v-model="newLinkData.bg">
                </div>
                <div class="form-group">
                    <label for="color">Font Color</label>
                    <input type="color" name="color" id="color" v-model="newLinkData.color">
                </div>
                <button type='submit' class="submit">Save</button>
            </form>
            <div >
                <a target="_blank" class="link-preview" :style="`color: ${newLinkData.color}; background: ${newLinkData.bg}`" :href="newLinkData.url">
                    <b class="link-title">{{ newLinkData.title }}</b><br>
                </a>
            </div>
        </div>
    </dialog>

    <dialog id='edit-link-modal'>
        <div class="modal-header">
            <h2>Edit Link</h2>
            <button class='close-modal' onclick="document.getElementById('edit-link-modal').close()">&times;</button>
        </div>
        <div class="modal-body">
            <form class="sign-in-form" onsubmit="document.getElementById('edit-link-modal').close()"
            @submit.prevent="editLink(editLinkData, tree, editLinkIndex); editLinkIndex = null">
                <div class="form-group">
                    <label for="titleE">Link title</label>
                    <input type="text" id="titleE" v-model="editLinkData.title" placeholder='Title' required>
                </div>
                <div class="form-group">
                    <label for="urlE">URL</label>
                    <input name="url" type='url' id="urlE" v-model="editLinkData.url" placeholder='Link'>
                </div>
                <hr>
                <div class="form-group">
                    <label for="bgE">Link background</label>
                    <input type="color" name="bg" id="bgE" v-model="editLinkData.bg">
                </div>
                <div class="form-group">
                    <label for="colorE">Font Color</label>
                    <input type="color" name="color" id="colorE" v-model="editLinkData.color">
                </div>
                <button type='submit' class="submit">Save</button>
            </form>
            <div >
                <a target="_blank" class="link-preview" :style="`color: ${editLinkData.color}; background: ${editLinkData.bg}`" :href="editLinkData.url">
                    <b class="link-title">{{ editLinkData.title }}</b><br>
                </a>
            </div>
        </div>
    </dialog>

    <dialog id='edit-tree-modal' v-if='tree'>
        <div class="display-none" v-if='tree.bg'>
            {{ editTreeData.desc = editTreeData.desc ?? tree?.desc }}
            {{ editTreeData.bg = editTreeData.bg ?? (tree.bg ?? '#fff') }}
            {{ editTreeData.color = editTreeData.color ?? (tree.color ?? '#000') }}
        </div>
        <div class="modal-header">
            <h2>Edit tree</h2>
            <button class='close-modal' onclick="document.getElementById('edit-tree-modal').close()">&times;</button>
        </div>
        <div class="modal-body">
            <form class="sign-in-form" onsubmit="document.getElementById('edit-tree-modal').close()" @submit.prevent="editTreeSettings(editTreeData, tree?.id)">
                <div class="form-group">
                    <label for="bioET">Bio</label>
                    <textarea name="bio" id="bioET" rows="5" v-model="editTreeData.desc" placeholder='bio'></textarea>
                </div>
                <hr>
                <div class="form-group">
                    <label for="bgET">Profile Background</label>
                    <input type="color" name="bg" id="bgET" v-model="editTreeData.bg">
                </div>
                <div class="form-group">
                    <label for="colorET">Font Color</label>
                    <input type="color" name="color" id="colorET" v-model="editTreeData.color">
                </div>
                <button type='submit' class="submit">Save</button>
            </form>
            <div class="preview profile-header" :style="`color: ${editTreeData.color}; background-color: ${editTreeData.bg}`">
                <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${tree?.pfp || 'defaultProfile_u6mqts'}`">
                <h2>@{{ user.username }}</h2>
                <p class="profile-bio" id="profile-bio">{{ editTreeData?.desc }}</p>
            </div>
        </div>
    </dialog>
</template>
<style scoped>
*, *::before, *::after {
    box-sizing: border-box;
}

.link-preview {
    display: block;
    text-align: center;
    max-width: 100%;
    padding: 1em 3em;
    font-size: 1.7rem;
    text-decoration: none;
}

.create-link {
    font-size: 1.3rem;
    border: none;
    background: rgb(3, 3, 163);
    color: white;
    padding: 0.5em;
}

.create-link-button-container {
    text-align: center;
}

section {
    display: grid;
    grid-template-columns: 50% 50%;
}

.edit-links {
    text-align: center;
}

.link {
    width: 75%;
    margin: 0.5em auto;
    padding: 1em;
    display: grid;
    grid-template-columns: 70% 30%;
}

.link > b {
    font-size: 1.3rem;
}

.buttons {
    display: flex;
    align-items: center;
    justify-content: center;
}

.link button {
    background: none;
    color: white;
    border: none;
    margin-inline: 0.3%;
}

.add-link {
    margin-top: 0.3em;
}

#add-link-modal:modal, #edit-link-modal:modal, #edit-tree-modal:modal {
    max-width: 80dvw;
}

button:disabled {
    color: grey;
    cursor: default
}

.submit {
    border: none;
    background: rgb(3, 76, 122);
    color: white;
    font-size: 1.3rem;
    padding: 0.5em;
    border-radius: 10px
}

.pfp {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    object-fit: cover;
}

.profile-header h2 {
    font-size: 1.5rem;
}

.preview iframe {
    width: 500px;
    border: none;
    height: 100dvh;
}

@media only screen and (min-width: 1000px) {
    #add-link-modal .modal-body,
    #edit-link-modal .modal-body,
    #edit-tree-modal .modal-body {
        display: grid;
        grid-template-columns: 2fr 1fr;
    }
    #add-link-modal form,
    #edit-link-modal form,
    #edit-tree-modal form {
        max-height: 70dvh;
        overflow-y: scroll;
    }
}
</style>