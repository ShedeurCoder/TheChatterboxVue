<script setup>
import useProfile from "@/composables/useProfile";
import useAuth from '@/composables/useAuth'
import useRandom from '@/composables/useRandom'
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router' 
const { follow, unfollow, editProfile, editMessage, editPfp } = useProfile()
const { userData } = useAuth()
const { turnToParse } = useRandom()
const props = defineProps({
    profileData: Object,
    path: String
})

const formData = ref({
    displayName: null,
    bio: null,
    url: null,
    bg: null,
    secondaryBg: null,
    color: null
})

watch(() => props.profileData?.bio, () => {
    setTimeout(turnToParse, 750)
}, {immediate:true, deep: true})

const widget = window.cloudinary.createUploadWidget(
  {cloud_name: 'dmftho0cx', upload_preset: 'chatterbox-vue', sources: ['local', 'url']},
  (err, result) => {
    if (!err && result && result.event === 'success') {
      editPfp(userData.value.id, result.info.public_id, userData.value.username)
    }
  }
)

function openUploadWidget() {
  widget.open()
}
</script>
<template>
    <div class="profile-header" :style="profileData?.bg ? `background-color: ${profileData?.bg}; color: ${profileData?.color}` : ''">
        <button v-if="userData && userData?.username === profileData?.username" @click="openUploadWidget()" class="edit-pfp">
            <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${profileData?.pfp || 'defaultProfile_u6mqts'}`">
            <i class='fas fa-edit'></i>
        </button>
        <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${profileData?.pfp || 'defaultProfile_u6mqts'}`" v-else>
        <h1 class="profile-name">{{ profileData?.displayName || 'User does not exist' }}</h1>
        <h2 class="profile-username">
            @{{ profileData?.username }}
            <i v-if='profileData?.verified' class='fas fa-check-circle'></i>
        </h2>
        <small v-if='profileData?.owner'>Owner</small>
        <small v-else-if='profileData?.tester'>Test account</small>
        <small v-else-if='profileData?.admin'>Admin</small>
        <p class="profile-bio" data-onparse="createAt()" id="profile-bio" v-if="profileData">{{ profileData?.bio }}</p>
        <a :href='profileData?.url' target='_blank' v-if="profileData?.url"><i class="fas fa-link"></i> {{ profileData?.url }}</a>
        <div class="followers-following">
            <span class="followers" onclick="document.getElementById('followers-modal').showModal()">{{ profileData?.followers.length }} followers</span>
            <span class="divider">|</span>
            <span class="following" onclick="document.getElementById('following-modal').showModal()">{{ profileData?.following.length }} following</span>
        </div>
        <button @click='follow(profileData, userData)' v-if="userData && profileData && userData?.username !== profileData?.username && !profileData?.followers.includes(userData?.username)" class="follow-button">Follow</button>
        <button @click="unfollow(profileData, userData)" v-else-if="userData && profileData && userData?.username !== profileData?.username && profileData?.followers.includes(userData?.username)" class="unfollow-button">Unfollow</button>
        <button onclick="document.getElementById('edit-profile-modal').showModal()" v-else-if="userData && userData?.username === profileData?.username" class="edit-profile">Edit profile</button>

        <nav>
            <RouterLink :to="`/@${profileData?.username}`" 
            :class="!path.includes('comments') && !path.includes('likes') ? 'active' : ''"
            :style="profileData?.color ? `color: ${profileData?.color}; --color: ${profileData?.color}`
            : '--color: #fff'">Posts</RouterLink>

            <RouterLink :to="`/@${profileData?.username}/comments`"
            :class="path.includes('comments') ? 'active' : ''"
            :style="profileData?.color ? `color: ${profileData?.color}; --color: ${profileData?.color}`
            : '--color: #fff'">Comments</RouterLink>

            <RouterLink :to="`/@${profileData?.username}/likes`"
            :class="path.includes('likes') ? 'active' : ''"
            :style="profileData?.color ? `color: ${profileData?.color}; --color: ${profileData?.color}`
            : '--color: #fff'">Likes</RouterLink>
        </nav>
    </div>

    <dialog id="followers-modal">
        <div class="modal-header">
            <h2>{{ profileData?.username }}'s followers</h2>
            <button class='close-modal' onclick="document.getElementById('followers-modal').close()">&times;</button>
        </div>
        <div class="user-list">
            <div class="user-container-container" v-for="(user) in profileData?.followers" :key='`followers${user.id}`'>
                <RouterLink :to='`/@${user}`' onclick="document.getElementById('followers-modal').close()">
                    <div class="user-container">
                        <h2>@{{ user }}</h2>
                    </div>
                </RouterLink>
            </div>
        </div>
    </dialog>

    <dialog id="following-modal">
        <div class="modal-header">
            <h2>{{ profileData?.username }}'s following</h2>
            <button class='close-modal' onclick="document.getElementById('following-modal').close()">&times;</button>
        </div>
        <div class="user-list">
            <div class="user-container-container" v-for="(user) in profileData?.following" :key='`following${user.id}`'>
                <RouterLink :to='`/@${user}`' onclick="document.getElementById('following-modal').close()">
                    <div class="user-container">
                        <h2>@{{ user }}</h2>
                    </div>
                </RouterLink>
            </div>
        </div>
    </dialog>
    
    <dialog id='edit-profile-modal' v-if="userData && userData?.username === profileData?.username">
        <p v-if='editMessage'>{{ editMessage }}</p>
        <div class="display-none">
            {{ formData.displayName = formData.displayName ?? profileData?.displayName }}
            {{ formData.bio = formData.bio ?? profileData?.bio }}
            {{ formData.url = formData.url ?? profileData?.url }}
            {{ formData.bg = formData.bg ?? (profileData.bg ?? '#303030') }}
            {{ formData.color = formData.color ?? (profileData.color ?? '#FFFFFF') }}
            {{ formData.secondaryBg = formData.secondaryBg ?? (profileData.secondaryBg ?? '##343A40') }}
        </div>
        <div class="modal-header">
            <h2>Edit profile</h2>
            <button class='close-modal' onclick="document.getElementById('edit-profile-modal').close()">&times;</button>
        </div>
        <div class="modal-body">
            <form class="sign-in-form" onsubmit="document.getElementById('edit-profile-modal').close()" @submit.prevent="editProfile(formData, userData.id)">
                <div class="form-group">
                    <label for="displayName">Display name</label>
                    <input type="text" id="displayName" v-model="formData.displayName" placeholder='Display name' required>
                </div>
                <div class="form-group">
                    <label for="bio">Bio</label>
                    <textarea name="bio" id="bio" rows="5" v-model="formData.bio" placeholder='bio'></textarea>
                </div>
                <div class="form-group">
                    <label for="url">URL</label>
                    <input name="url" type='url' id="url" v-model="formData.url" placeholder='Link'>
                </div>
                <hr>
                <button @click="formData.bg = '#303030'; formData.color = '#ffffff'; formData.secondaryBg = '#343a40'"
                type="button" class="restore">Restore default colors</button>
                <div class="form-group">
                    <label for="bg">Profile Background</label>
                    <input type="color" name="bg" id="bg" v-model="formData.bg">
                </div>
                <div class="form-group">
                    <label for="secondary-bg">Profile Secondary Background</label>
                    <input type="color" name="secondary-bg" id="secondary-bg" v-model="formData.secondaryBg">
                </div>
                <div class="form-group">
                    <label for="color">Font Color</label>
                    <input type="color" name="color" id="color" v-model="formData.color">
                </div>
                <button type='submit' class="submit">Save</button>
            </form>
            <div class="preview profile-header" :style="`color: ${formData.color}; background-color: ${formData.bg}`">
                <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${profileData?.pfp || 'defaultProfile_u6mqts'}`">
                <h1 class="profile-name">{{ formData.displayName }}</h1>
                <h2 class="profile-username">
                    @{{ profileData?.username }}
                    <i v-if='profileData?.verified' class='fas fa-check-circle'></i>
                </h2>
                <p class="profile-bio" id="profile-bio">{{ formData?.bio }}</p>
                <a :href='formData?.url' target='_blank' v-if="formData?.url"><i class="fas fa-link"></i> {{ profileData?.url }}</a>
            </div>
        </div>
    </dialog>
</template>
<style scoped>
    nav {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        max-width: 80ch;
        margin: 0 auto;
        margin-top: 0.7em;
    }
    nav a {
        display: block;
        color: white;
        font-size: 1.5rem;
        position: relative;
    }
    nav a:hover {
        color: white;
        text-decoration: none;
    }
    .active::after {
        content: '';
        height: 3px;
        width: 100%;
        background-color: var(--color);
        display: block;
        position: absolute;
        bottom: -15px;
        left: 0;
    }
    .user-container h2 {
        font-size: 1.3rem;
    }
    .follow-button {
        font-size: 1.5rem;
        background: #007bff;
        border: none;
        color: white;
        margin-top: 1em;
        padding: 0.5em;
        border-radius: 5px;
        transition: 150ms;
    }
    .profile-bio {
        margin: 15px;
    }
    .follow-button:hover {
        background: #026ee1;
    }
    .unfollow-button {
        background: white;
        color: black;
        border: none;
        padding: 0.5em;
        font-size: 1rem;
        border-radius: 5px;
        margin-top: 1em;
    }
    .form-group textarea {
        font-family: inherit;
        font-size: 1.3rem;
        width: 100%;
        resize: vertical;
    }
    .edit-profile {
        border: #007bff 1px solid;
        color: #007bff;
        padding: 0.5em;
        background: none;
        margin-top: 1em;
        border-radius: 5px;
        font-size: 1.1rem;
        transition: 300ms;
    }
    .edit-profile:hover {
        background: #007bff;
        color: white;
    }
    .submit {
        font-size: 1.3rem;
        background: none;
        border: 1px solid green;
        color: green;
        margin-inline: 0.3em;
        padding: 0.5em;
        border-radius: 5px;
        cursor: pointer;
        transition: 300ms;
    }
    .submit:hover {
        background: green;
        color: white;
    }
    .user-container {
        background: #000000;
        padding: 1em;
        color: white;
    }
    .user-list {
        text-align: center;
    }
    .followers, .following {
        cursor: pointer;
    }
    .pfp {
        height: 150px;
        width: 150px;
        border-radius: 50%;
        object-fit: cover;
    }
    .preview .pfp {
        width: 100px;
        height: 100px;
    }
    .edit-pfp {
        border-radius: 50%;
        border: none;
        background: none;
        position: relative;
    }
    .fa-edit {
        z-index: 99;
        color: white;
        display: none;
        position: absolute;
        bottom: 5px;
        right: 5px;
        font-size: 1.3rem
    }
    .edit-pfp:hover .fa-edit {
        display: inline;
    }
    small {
        font-size: 1.5rem;
    }
    a {
        color: #007bff;
        font-size: 1.1rem;
        margin: 1em;
        text-decoration: none;
        display: block;
    }
    a:hover {
        text-decoration: underline;
        color: #094d97;
    }
    a i {
        text-decoration: none;
        color: white;
    }
    #edit-profile-modal:modal {
        max-width: 80dvw;
    }
    .restore {
        background: #026ee1;
        border: none;
        color: white;
        margin-top: 0.7em;
        padding: 0.5em;
    }
    @media only screen and (min-width: 1000px) {
        #edit-profile-modal:modal .modal-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        #edit-profile-modal form {
            max-height: 70dvh;
            overflow-y: scroll;
        }
    }
</style>