<script setup>
import { RouterLink } from 'vue-router'
import useAuth from '@/composables/useAuth'
import usePostPage from '@/composables/usePostPage'
const { likeComment, unlikeComment, deleteComment } = usePostPage()
const { userData } = useAuth()
defineProps({
    post: Object
})
</script>
<template>
    <div class='post-wrapper'>
        <div class="post-header">
            <small>{{ Date(post.createdAt).split(' ').splice(1, 3).join(' ') }}</small>
            <RouterLink :to="`/@${post.username}`" style='text-decoration: none;'>
                <h2>@{{ post.username }}</h2>
            </RouterLink>
        </div>
        <RouterLink :to="`/post/${post.id}`" class="post-body-link">
            <div class="post-body">
                {{ post.message }}
            </div>
        </RouterLink>
        <div class="post-footer">
            <button @click="deleteComment(post.id)" v-if="userData?.username === post.username" class="delete"><i class="fas fa-trash"></i></button>

            <button v-if="userData && post.likes.includes(userData?.username)" class="like" @click="unlikeComment(post, userData.username)"><i class="fas fa-heart liked"></i>&nbsp;{{ post.likes.length }}</button>
            <button v-else-if="userData && !post.likes.includes(userData?.username)" class="like" @click="likeComment(post, userData.username)"><i class="fas fa-heart"></i>&nbsp;{{ post.likes.length }}</button>
            <button v-else class="like"><i class="fas fa-heart"></i>&nbsp;{{ post.likes.length }}</button>
        </div>
    </div>
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
    .post-wrapper h2 {
        color: white;
    }
    .post-header small {
        font-size: 1.3rem;
        float: right;
    }
    .post-header {
        margin-bottom: 2em;
    }
    .post-body {
        color: white;
        font-size: 1.3rem;
    }
    .post-body-link {
        text-decoration: none;
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
    .post-footer .like {
        float: right;
    }
</style>