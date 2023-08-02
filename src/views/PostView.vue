<script setup>
import Comment from '@/components/Comment.vue'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import usePostPage from '@/composables/usePostPage'
import usePosts from '@/composables/usePosts'
import useAuth from '@/composables/useAuth'
const { userData } = useAuth()
const { likePost, unlike } = usePosts()
const { postData, createComment, comments } = usePostPage()

const replyInput = ref('')
</script>
<template>
    <div class="post">
        <div class="post-header">
            <small>{{ Date(postData?.createdAt).split(' ').splice(1, 3).join(' ') }}</small>
            <RouterLink :to="`/@${postData?.username}`" class='post-user'>
                <h2>@{{ postData?.username }}</h2>
            </RouterLink>
        </div>
        <div class="post-body">
            <p class="post-message">{{ postData?.message }}</p>
        </div>
        <div class="post-footer">
            <button v-if="userData && postData?.likes.includes(userData?.username)" class="like" @click="unlike(postData, userData.username)"><i class="fas fa-heart liked"></i>&nbsp;{{ postData?.likes.length }}</button>
            <button v-else-if="userData && !postData?.likes.includes(userData?.username)" class="like" @click="likePost(postData, userData.username)"><i class="fas fa-heart"></i>&nbsp;{{ postData?.likes.length }}</button>
            <button v-else class="like"><i class="fas fa-heart"></i>&nbsp;{{ postData?.likes.length }}</button>
        </div>
    </div>

    <form class="reply-form" @submit.prevent="createComment(replyInput, userData.username, postData?.id); replyInput = ''">
        <input type="text" v-model="replyInput" placeholder="Create a comment" v-if="userData">
        <input type="text" value="Login to comment" disabled v-else>
        <button type="button" @click.prevent="createComment(replyInput, userData.username, postData?.id)" v-if="userData">Comment</button>
        <button type="button" v-else>Comment</button>
    </form>

    <div class='profile-posts'>
        <Comment :post="comment" v-for='comment in comments' :key='comment.id'/>
    </div>
</template>
<style scoped>
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
    .reply-form {
        display: grid;
        grid-template-columns: calc(80% - 10px) 20%;
        gap: 10px;
        margin: 1em;
    }
    .reply-form input {
        font-size: 1.3rem;
        padding: 0.75em;
        background-color: #1c1c1c;
        color: white;
        border: none;
    }
    .reply-form button {
        font-size: 1.3rem;
        background: rgb(0, 119, 255);
        color: white;
        border: none;
        border-radius: 10px;
    }
</style>