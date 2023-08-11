<script setup>
import useAuth from '@/composables/useAuth'
import usePostPage from '@/composables/usePostPage'
import { ref } from 'vue'
const { likeComment, unlikeComment, deleteComment } = usePostPage()
const { userData } = useAuth()
const props = defineProps({
    post: Object,
    postComments: Number
})

const date = new Date(props.post.createdAt.seconds * 1000)
const readableDate = ref(date.toString().split(' ').splice(1, 3).join(' '))

if (readableDate.value == Date().toString().split(' ').splice(1, 3).join(' ')) {
    readableDate.value = date.toString().split(' ').splice(4, 1).join(' ').split(':').splice(0, 2).join(':')

    const [hourString, minute] = readableDate.value.split(":");
    const hour = +hourString % 24;
    readableDate.value = 'Today at ' + (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM")
}
</script>
<template>
    <div class='post-wrapper'>
        <div class="post-header">
            <small>{{ readableDate }}</small>
            <RouterLink :to="`/@${post.username}`" style='text-decoration: none;' class="post-user-link">
                <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${post?.pfp || 'defaultProfile_u6mqts'}`">
                <h2>
                    @{{ post.username }}
                    <i v-if='post.verified' class='fas fa-check-circle'></i>
                </h2>
            </RouterLink>
        </div>
        <div class="post-body">
            {{ post.message }}
        </div>
        <div class="post-footer">
            <button @click="deleteComment(post.id, post.postId, postComments)" v-if="userData?.username === post.username || userData?.admin" class="delete"><i class="fas fa-trash"></i></button>

            <span class="like-button" v-if="userData && post.likes.includes(userData?.username)">
                <button class="like" @click="unlikeComment(post, userData.username)">
                    <i class="fas fa-heart liked"></i>
                </button>
                <span :onclick="`document.getElementById('likes-modal${post.id}').showModal()`">{{ post.likes.length }}</span>
            </span>

            <span class="like-button" v-else-if="userData && !post.likes.includes(userData?.username)">
                <button class="like" @click="likeComment(post, userData.username)">
                    <i class="fas fa-heart"></i>
                </button>
                <span :onclick="`document.getElementById('likes-modal${post.id}').showModal()`">{{ post.likes.length }}</span>
            </span>

            <span class="like-button" v-else>
                <button class="like">
                    <i class="fas fa-heart"></i>
                </button>
                <span :onclick="`document.getElementById('likes-modal${post.id}').showModal()`">{{ post.likes.length }}</span>
            </span>
        </div>
    </div>
    <dialog :id="`likes-modal${post.id}`">
        <div class="modal-header">
            <h2>Likes</h2>
            <button class='close-modal' :onclick="`document.getElementById('likes-modal${post.id}').close()`">&times;</button>
        </div>
        <div class="user-list">
            <div class="user-container-container" v-for="(user) in post?.likes" :key='`like${user}${post.id}`'>
                <RouterLink :to='`/@${user}`' :onclick="`document.getElementById('likes-modal${post.id}').close()`">
                    <div class="user-container">
                        <h2>@{{ user }}</h2>
                    </div>
                </RouterLink>
            </div>
        </div>
    </dialog>
</template>
<style scoped>
    .post-wrapper {
        width: 80%;
        max-width: 70ch;
        margin: 1em auto;
        background-color: #303030;
        padding: 2em;
        border-radius: 20px;
        padding-top: 1em;
    }
    .post-footer .like-button span {
        font-size: 1.3rem;
        color: rgb(218, 218, 218);
        font-family: inherit;
        font-weight: bold;
        cursor: pointer;
    }
    .user-container {
        background: #000000;
        padding: 1.5em;
        color: white;
    }
    .user-list {
        text-align: center;
    }
    .user-container-container {
        margin-block: 0.5em;
    }
    .post-footer .like-button span:hover {
        text-decoration: underline;
    }
    .post-user-link {
        display: flex;
        align-items: center;
    }
    .post-wrapper h2 {
        color: white;
        display: inline;
    }
    .post-header small {
        font-size: 1.3rem;
        float: right;
        margin-top: 1em;
    }
    .post-header {
        margin-bottom: 1em;
    }
    .post-body {
        color: white;
        font-size: 1.3rem;
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
    .pfp {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 50%;
        display: inline;
        margin-right: 10px;
    }
</style>