<script setup>
import { RouterLink } from 'vue-router'
import usePosts from '@/composables/usePosts'
import { ref } from 'vue'
const { likePost, unlike } = usePosts()
const props = defineProps({
    postData: Object,
    userData: Object
})

const date = new Date(props.postData.createdAt.seconds * 1000)
const readableDate = ref(date.toString().split(' ').splice(1, 3).join(' '))

if (readableDate.value == Date().toString().split(' ').splice(1, 3).join(' ')) {
    readableDate.value = date.toString().split(' ').splice(4, 1).join(' ').split(':').splice(0, 2).join(':')

    const [hourString, minute] = readableDate.value.split(":");
    const hour = +hourString % 24;
    readableDate.value = 'Today at ' + (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM")
}
</script>
<template>
    <div class="post">
        <div class="post-header">
            <small>{{ readableDate }}</small>
            <RouterLink :to="`/@${postData?.username}`" class='post-user'>
                <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${postData?.pfp || 'defaultProfile_u6mqts'}`">
                <h2>
                    @{{ postData?.username }}
                    <i v-if='postData.verified' class='fas fa-check-circle'></i>
                </h2>
            </RouterLink>
        </div>
        <div class="post-body">
            <p class="post-message">{{ postData?.message }}</p>
        </div>
        <div class="post-footer">
            <span class="comments"><i class="fas fa-comment-alt"></i> {{ postData?.comments }}</span>

            <span class="like-button" v-if="userData && postData.likes.includes(userData?.username)">
                <button class="like" @click="unlike(postData, userData.username)">
                    <i class="fas fa-heart liked"></i>
                </button>
                <span onclick="document.getElementById('likes-modal').showModal()">{{ postData.likes.length }}</span>
            </span>

            <span class="like-button" v-else-if="userData && !postData.likes.includes(userData?.username)">
                <button class="like" @click="likePost(postData, userData.username)">
                    <i class="fas fa-heart"></i>
                </button>
                <span onclick="document.getElementById('likes-modal').showModal()">{{ postData.likes.length }}</span>
            </span>

            <span class="like-button" v-else>
                <button class="like">
                    <i class="fas fa-heart"></i>
                </button>
                <span onclick="document.getElementById('likes-modal').showModal()">{{ postData.likes.length }}</span>
            </span>
        </div>
    </div>
    <dialog id="likes-modal">
        <div class="modal-header">
            <h2>Likes</h2>
            <button class='close-modal' onclick="document.getElementById('likes-modal').close()">&times;</button>
        </div>
        <div class="user-list">
            <div class="user-container-container" v-for="(user) in postData?.likes" :key='`like${user}`'>
                <RouterLink :to='`/@${user}`' onclick="document.getElementById('likes-modal').close()">
                    <div class="user-container">
                        <h2>@{{ user }}</h2>
                    </div>
                </RouterLink>
            </div>
        </div>
    </dialog>
</template>
<style scoped>
    .comments {
        float: right;
        font-size: 1.4rem;
        font-weight: bold;
        color: rgb(218, 218, 218);
        margin-left: 0.75em;
    }
    .post-user {
        display: flex;
        align-items: center;
    }
    .post {
        background-color: #303030;
        padding: 2em;
        margin-inline: 1em;
    }
    .post-user {
        color: white;
        text-decoration: none;
        font-size: 1.3rem;
    }
    .post-header small {
        font-size: 1.4rem;
        float: right;
    }
    .post-body {
        padding-block: 0.5em;
    }
    .post-message {
        font-size: 1.5rem;
    }
    .liked {
        color: rgb(229, 8, 8);
    }
    .post-footer button {
        background: none;
        color: rgb(218, 218, 218);
        border: none;
        font-size: 1.3rem;
        font-family: inherit;
        font-weight: bold;
    }
    .post-footer .like-button span {
        font-size: 1.3rem;
        color: rgb(218, 218, 218);
        font-family: inherit;
        font-weight: bold;
        cursor: pointer;
    }
    .post-footer .like-button span:hover {
        text-decoration: underline;
    }
    .post-footer button:hover {
        color: rgb(205, 12, 12)
    }
    .delete {
        float: left;
    }
    .post-footer {
        margin-top: 1em;
        padding-bottom: 1.5em;
    }
    .post-footer .like-button {
        float: right;
    }
    h2 {
        display: inline;
    }
    .pfp {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 50%;
        display: inline;
        margin-right: 10px;
    }
    .user-container {
        background: #000000;
        padding: 2em;
        color: white;
    }
    .user-list {
        text-align: center;
    }
    .user-container-container {
        margin-block: 0.5em;
    }
</style>