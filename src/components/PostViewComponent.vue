<script setup>
import { RouterLink } from 'vue-router'
import { watch, ref } from 'vue'
import usePosts from '@/composables/usePosts'
import useAuth from '@/composables/useAuth'
import useRandom from '@/composables/useRandom'
const { styleDate, turnToParse } = useRandom()
const { likePost, unlike, save, unsave, quote } = usePosts()
const { pinPost, unpinPost } = useAuth()

const quoteFormData = ref('')

const props = defineProps({
    postData: Object,
    userData: Object
})

watch(() => props.postData?.message, (newVal, oldVal) => {
    setTimeout(turnToParse, 500)
}, {immediate:true, deep: true});

function alert(message) {
    window.alert(message)
}
</script>

<template>
    
    <div class="post">
        <div class="post-header">
            <small>{{ styleDate(postData?.createdAt) }}</small>
            <RouterLink :to="`/@${postData?.username}`" class='post-user'>
                <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${postData?.pfp || 'defaultProfile_u6mqts'}`">
                <h2>
                    @{{ postData?.username }}
                    <i v-if='postData.verified' class='fas fa-check-circle'></i>
                </h2>
            </RouterLink>
        </div>
        <div class="post-body">
            <p class="post-message" id="post-message" data-onparse="createAt()">{{ postData?.message }}</p>
            <a :href="`https://res.cloudinary.com/dmftho0cx/image/upload/${postData?.image}`" target='_blank'>
                <img v-if="postData?.image" class="post-image"
                :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${postData?.image}`">
            </a>
        </div>
        <RouterLink class="quote" v-if="postData?.quoted" :to="`/post/${postData?.quoted}`">
            <div class="quote-header">
                <img class="pfp quote-pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${postData?.quotedPfp || 'defaultProfile_u6mqts'}`">
                <h3>@{{ postData?.quotedUsername }}</h3>
            </div>
            <p>{{ postData?.quotedMessage }}</p>
        </RouterLink>
        <div class="post-footer">
            <button v-if="userData && userData?.username === postData?.username && postData?.id === userData.pinned" 
            class="pin pinned" @click='unpinPost(userData)'>
                <i class="fas fa-thumbtack"></i>
            </button>

            <button v-if="userData && userData?.username === postData?.username && postData?.id !== userData?.pinned" 
            class="pin" @click='pinPost(postData, userData)'>
                <i class="fas fa-thumbtack"></i>
            </button>

            <button class="bookmark" v-if="userData?.saves?.includes(postData?.id)" @click="unsave(postData?.id, userData)">
                <i class="fas fa-bookmark saved"></i>
            </button>

            <button class="bookmark" v-else-if="userData && !userData?.blockedBy?.includes(postData?.username)" @click="save(postData?.id, userData)">
                <i class="fas fa-bookmark"></i>
            </button>

            <button class="rt" v-if="userData && !userData?.blockedBy?.includes(postData?.username)" onclick="document.getElementById('rt-modal').showModal()">
                <i class="fas fa-retweet"></i>
            </button>

            <span class="comments"><i class="fas fa-comment-alt"></i> {{ postData?.comments }}</span>

            <span class="like-button" v-if="userData && postData.likes.includes(userData?.username) && !userData?.blockedBy?.includes(postData?.username)">
                <button class="like" @click="unlike(postData, userData.username)">
                    <i class="fas fa-heart liked"></i>
                </button>
                <span onclick="document.getElementById('likes-modal').showModal()">{{ postData.likes.length }}</span>
            </span>

            <span class="like-button" v-else-if="userData && !postData.likes.includes(userData?.username) && !userData?.blockedBy?.includes(postData?.username)">
                <button class="like" @click="likePost(postData, userData.username)">
                    <i class="fas fa-heart"></i>
                </button>
                <span onclick="document.getElementById('likes-modal').showModal()">{{ postData.likes.length }}</span>
            </span>

            <span class="like-button" v-else>
                <button class="like" @click="userData?.blockedBy?.includes(postData?.username) ? alert('You have been blocked by this user. You may not interact with them') : alert('Make an account to start liking posts!')">
                    <i class="fas fa-heart"></i>
                </button>
                <span onclick="document.getElementById('likes-modal').showModal()">{{ postData.likes.length }}</span>
            </span>
        </div>
    </div>
    <dialog id="rt-modal">
        <div class="modal-header">
            <h2>Quote this post</h2>
            <button class='close-modal' onclick="document.getElementById('rt-modal').close()">&times;</button>
        </div>
        <form class="sign-in-form" onsubmit="document.getElementById('rt-modal').close()" @submit.prevent="quote(postData, quoteFormData, userData); postFormData = ''">
            <div class="form-group">
                <label for="message">Message:</label>
                <textarea id="message" v-model="quoteFormData" placeholder="What's up?" required rows="7" maxlength="1000"></textarea>
            </div>
            <button type='submit' class='login-signup'>Quote post</button>
        </form>
    </dialog>
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
    .post-image {
        max-height: 500px;
        max-width: 100%;
    }

    .pin {
        float: right;
        margin-left: 0.5em;
    }
    .rt {
        float: right;
        margin-left: 0.5em;
    }
    .bookmark {
        float: right;
        margin-left: 0.5em;
    }
    .rt:hover {
        color: rgb(5, 196, 5);
    }
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
    .bookmark:hover .fa-bookmark {
        color: #0099ff;
    }
    .post-footer .like-button button:hover {
        color: rgb(205, 12, 12)
    }
    .saved {
        color: #0077ff;
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
    .pin.pinned .fas.fa-thumbtack {
        color: white;
    }
    .pin:hover {
        color: white;
    }
    .quote-pfp {
        width: 60px;
        height: 60px;
    }
    .quote {
        display: block;
        border: 3px solid black;
        padding: 1.5em;
        border-radius: 20px;
        color: white;
        text-decoration: none;
    }
    .quote p {
        font-size: 1.4rem;
        margin-inline: 0.2em;
    }
    .quote h3 {
        display: inline;
        font-size: 1.5rem;
    }
    .quote-header {
        display: flex;
        align-items: center;
    }
</style>