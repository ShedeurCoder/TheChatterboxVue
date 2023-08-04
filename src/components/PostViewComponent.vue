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
                <h2>@{{ postData?.username }}</h2>
            </RouterLink>
        </div>
        <div class="post-body">
            <p class="post-message">{{ postData?.message }}</p>
        </div>
        <div class="post-footer">
            <span class="comments"><i class="fas fa-comment-alt"></i> {{ postData?.comments }}</span>
            <button v-if="userData && postData?.likes.includes(userData?.username)" class="like" @click="unlike(postData, userData.username)"><i class="fas fa-heart liked"></i>&nbsp;{{ postData?.likes.length }}</button>
            <button v-else-if="userData && !postData?.likes.includes(userData?.username)" class="like" @click="likePost(postData, userData.username)"><i class="fas fa-heart"></i>&nbsp;{{ postData?.likes.length }}</button>
            <button v-else class="like"><i class="fas fa-heart"></i>&nbsp;{{ postData?.likes.length }}</button>
        </div>
    </div>
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
    .post-footer button i:hover {
        color: rgb(205, 12, 12)
    }
    .delete {
        float: left;
    }
    .post-footer {
        margin-top: 1em;
        padding-bottom: 1.5em;
    }
    .post-footer .like {
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
</style>