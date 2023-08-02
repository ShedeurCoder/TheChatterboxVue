<script setup>
    import useProfile from "@/composables/useProfile";
    import useAuth from '@/composables/useAuth'
    import { ref } from 'vue'
    const { profileData, follow, unfollow, editProfile, editMessage } = useProfile()
    const { userData } = useAuth()

    const formData = ref({
        displayName: null,
        bio: null
    })
</script>
<template>
    <div class="profile-header">
        <h1 class="profile-name">{{ profileData?.displayName }}</h1>
        <h2 class="profile-username">@{{ profileData?.username }}</h2>
        <p class="profile-bio">{{ profileData?.bio }}</p>
        <div class="followers-following">
            <span class="followers" onclick="document.getElementById('followers-modal').showModal()">{{ profileData?.followers.length }} followers</span>
            <span class="divider">|</span>
            <span class="following" onclick="document.getElementById('following-modal').showModal()">{{ profileData?.following.length }} following</span>
        </div>
        <button @click='follow(profileData, userData)' v-if="userData && userData?.username !== profileData?.username && !profileData?.followers.includes(userData?.username)" class="follow-button">Follow</button>
        <button @click="unfollow(profileData, userData)" v-else-if="userData && userData?.username !== profileData?.username && profileData?.followers.includes(userData?.username)" class="unfollow-button">Unfollow</button>
        <button onclick="document.getElementById('edit-profile-modal').showModal()" v-else-if="userData && userData?.username === profileData?.username" class="edit-profile">Edit profile</button>
    </div>

    <dialog id="followers-modal">
        <div class="modal-header">
            <h2>{{ profileData?.username }}'s followers</h2>
            <button class='close-modal' onclick="document.getElementById('followers-modal').close()">&times;</button>
        </div>
        <div class="user-list">
            <div class="user-container-container" v-for="(user) in profileData?.followers" :key='`followers${user.id}`'>
                <a :href='`/@${user}`'>
                    <div class="user-container">
                        <h2>@{{ user }}</h2>
                    </div>
                </a>
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
                <a :href='`/@${user}`'>
                    <div class="user-container">
                        <h2>@{{ user }}</h2>
                    </div>
                </a>
            </div>
        </div>
    </dialog>
    
    <dialog id='edit-profile-modal' v-if="userData && userData?.username === profileData?.username">
        <p v-if='editMessage'>{{ editMessage }}</p>
        <div class="display-none">
            {{ formData.displayName = formData.displayName ?? profileData?.displayName }}
            {{ formData.bio = formData.bio ?? profileData?.bio }}
        </div>
        <div class="modal-header">
            <h2>Edit profile</h2>
            <button class='close-modal' onclick="document.getElementById('edit-profile-modal').close()">&times;</button>
        </div>
        <form class="sign-in-form">
                <div class="form-group">
                    <label for="displayName">Display name</label>
                    <input type="text" id="displayName" v-model="formData.displayName" placeholder='Display name'>
                </div>
                <div class="form-group">
                    <label for="bio">Bio</label>
                    <textarea name="bio" id="bio" rows="10" v-model="formData.bio" placeholder='bio'></textarea>
                </div>
                <button type='button' @click.prevent="editProfile(formData.displayName, formData.bio, userData.id)" class="submit">Submit</button>
            </form>
    </dialog>
</template>
<style>
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
    .user-container-container {
        margin-block: 0.5em;
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
    .display-none {
        display: none;
    }
</style>