<script setup>
import useAuth from '@/composables/useAuth'
import usePosts from '@/composables/usePosts'
import useRandom from '@/composables/useRandom'
const { likeComment, unlikeComment } = usePosts()
const { styleDate } = useRandom()
const { userData } = useAuth()
const props = defineProps({
    post: Object,
    profile: Object
})
</script>
<template>
    <div class='post-wrapper' :style="profile && profile?.bg ? `background-color: ${profile?.bg}; color: ${profile?.color}` : ''">
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
        <div class="post-body">
            <RouterLink :to="`/post/${post.postId}?c=${post.id}`" class="post-body-link">
                <p :style="profile && profile?.color ? `color: ${profile?.color}` : ''">{{ post.message }}</p>
            </RouterLink>
        </div>
        <div class="post-footer">

            <button class="show-replies">
                <i class='fas fa-comment-alt'></i>
                <span>&nbsp;{{ post.replies?.length ?? 0 }}</span>
            </button>

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
    .post-body-link {
        text-decoration: none;
        color: white;
    }
    .show-replies {
        float: right;
        margin-left: 0.5em;
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
    .like-button button:hover {
        color: rgb(205, 12, 12)
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
    .show-replies:hover i, .show-replies:hover span {
        color: white;
    }
</style>