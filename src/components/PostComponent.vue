<script setup>
import { RouterLink } from 'vue-router'
import useAuth from '@/composables/useAuth'
import usePosts from '@/composables/usePosts'
import useRandom from '@/composables/useRandom'
const { likePost, unlike, deletePost } = usePosts()
const { styleDate } = useRandom()
const { userData } = useAuth()
const props = defineProps({
    post: Object,
    pinned: Boolean,
    profile: Object
})
</script>
<template>
    <div class='post-wrapper' :style="profile && profile?.bg ? `background-color: ${profile?.bg}; color: ${profile?.color}` : ''">
        <h1 class="pinned" v-if="pinned"><i class="fas fa-thumbtack"></i> Pinned post</h1>
        <div class="post-header">
            <small>{{ styleDate(post.createdAt) }}</small>
            <RouterLink :to="`/@${post.username}`" style='text-decoration: none;' class="post-user-link">
                <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${post?.pfp || 'defaultProfile_u6mqts'}`">
                <h2 :style="profile && profile?.color ? `color: ${profile?.color}` : ''">
                    @{{ post.username }}
                    <i v-if='post.verified' class='fas fa-check-circle'></i>
                </h2>
            </RouterLink>
        </div>
        <RouterLink :to="`/post/${post.id}`" class="post-body-link">
            <div class="post-body">
                <p :style="profile && profile?.color ? `color: ${profile?.color}` : ''">{{ post.message }}</p>
                <img v-if="post?.image" class="post-image" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${post?.image}`">
            </div>
        </RouterLink>
        <RouterLink class="quote" v-if="post?.quoted" :to="`/post/${post?.quoted}`">
            <div class="quote-header">
                <img class="pfp quote-pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${post?.quotedPfp || 'defaultProfile_u6mqts'}`">
                <h3 :style="profile && profile?.color ? `color: ${profile?.color}` : ''">@{{ post?.quotedUsername }}</h3>
            </div>
            <p :style="profile && profile?.color ? `color: ${profile?.color}` : ''">{{ post?.quotedMessage }}</p>
        </RouterLink>
        <div class="post-footer">
            <button @click="deletePost(post.id)" v-if="userData?.username === post.username || userData?.admin" class="delete"><i class="fas fa-trash"></i></button>

            <span class="comments"><i class="fas fa-comment-alt"></i> {{ post?.comments }}</span>
            <button v-if="userData && post.likes.includes(userData?.username)" class="like" @click="unlike(post, userData.username)"><i class="fas fa-heart liked"></i>&nbsp;{{ post.likes.length }}</button>
            <button v-else-if="userData && !post.likes.includes(userData?.username)" class="like" @click="likePost(post, userData.username)"><i class="fas fa-heart"></i>&nbsp;{{ post.likes.length }}</button>
            <button v-else class="like"><i class="fas fa-heart"></i>&nbsp;{{ post.likes.length }}</button>
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

    .post-image {
        max-height: 350px;
        max-width: 100%;
    }
    .post-user-link {
        display: flex;
        align-items: center;
    }
    .post-wrapper {
        width: 80%;
        max-width: 80ch;
        margin: 1em auto;
        background-color: #303030;
        padding: 2em;
        border-radius: 20px;
        padding-top: 1em;
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
    .pfp {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 50%;
        display: inline;
        margin-right: 10px;
    }
    .pinned {
        font-size: 1.2rem;
    }
    .fa-thumbtack {
        margin-right: 0.3em;
    }
    .quote-pfp {
        width: 50px;
        height: 50px;
    }
    .quote {
        display: block;
        border: 3px solid black;
        padding: 1em;
        border-radius: 20px;
        color: white;
        text-decoration: none;
    }
    .quote p {
        font-size: 1.3rem;
        margin-inline: 0.1em;
    }
    .quote h3 {
        display: inline;
        font-size: 1.4rem;
    }
    .quote-header {
        display: flex;
        align-items: center;
    }
</style>