<script setup>
import useAuth from '@/composables/useAuth'
import usePostPage from '@/composables/usePostPage'
import useRandom from '@/composables/useRandom'
import { ref, onMounted } from 'vue'
import Reply from '@/components/Reply.vue'
const { likeComment, unlikeComment, deleteComment, makeReply, pin, unpin } = usePostPage()
const { styleDate, onParse } = useRandom()
const { userData } = useAuth()
const props = defineProps({
    post: Object,
    postData: Object,
    highlighted: Boolean,
    pinned: Boolean
})

onMounted(() => {
    onParse()
})

const replyFormInput = ref(null)
const showReplies = ref(false)
</script>
<template>
    <div class="comment-wrapper-wrapper">
        <div :class='`post-wrapper ${highlighted ? "highlighted" : ""} ${pinned ? "pinnedMessage" : ""}`'>
            <h3 class="pinned-comment-header" v-if='pinned'><i class="fas fa-thumbtack"></i> Pinned comment</h3>
            <h3 class="highlighted-comment-header" v-else-if='highlighted'>Highlighted comment</h3>
            <div class="post-header">
                <small>{{ styleDate(post.createdAt) }}</small>
                <RouterLink :to="`/@${post.username}`" style='text-decoration: none;' class="post-user-link">
                    <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${post?.pfp || 'defaultProfile_u6mqts'}`">
                    <h2>
                        @{{ post.username }}
                        <i v-if='post.verified' class='fas fa-check-circle'></i>
                    </h2>
                </RouterLink>
            </div>
            <div class="post-body">
                <p data-onparse="createAt()" :id='`comment${post.id}`'>{{ post.message }}</p>
            </div>
            <div class="post-footer">
                <button @click="deleteComment(post.id, post.postId, postData?.comments)" v-if="userData?.username === post.username || userData?.admin" class="delete"><i class="fas fa-trash"></i></button>

                <button v-if="userData && userData?.username === postData?.username && post?.id === postData?.pinned" class="pin pinned" @click='unpin(postData)'>
                    <i class="fas fa-thumbtack"></i>
                </button>

                <button v-if="userData && userData?.username === postData?.username && post?.id !== postData?.pinned" class="pin" @click='pin(post, postData, userData)'>
                    <i class="fas fa-thumbtack"></i>
                </button>

                <button class="show-replies" v-if="userData"
                :onclick="`document.getElementById('${post.id}ReplyForm').style.display == 'grid' ? 
                document.getElementById('${post.id}ReplyForm').style.display = 'none' : 
                document.getElementById('${post.id}ReplyForm').style.display = 'grid'`">
                    <i class='fas fa-comment-alt'></i>
                    <span>&nbsp;{{ post.replies?.length ?? 0 }}</span>
                </button>

                <button v-else class="show-replies">
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
        <form class="reply-form" :id="`${post.id}ReplyForm`" @submit.prevent="makeReply(replyFormInput, userData, post); replyFormInput = ''" v-if="userData">
            <div class="form-group">
                <input type="text" placeholder="Make a reply..." v-model="replyFormInput" required>
            </div>
            <div class="submit">
                <button type='submit'>Submit</button>
            </div>
            <div class="cancel">
                <button type="button"
                :onclick="`document.getElementById('${post.id}ReplyForm').style.display = 'none'`">Cancel</button>
            </div>
        </form>
        <button v-if='!showReplies && post.replies?.length > 0' class="show-replies-button" @click="showReplies = true">
            Show {{ post.replies?.length }} replies <i class="fas fa-caret-down"></i>
        </button>
        <button v-else-if='showReplies && post.replies?.length > 0' class="show-replies-button" @click="showReplies = false">
            Hide {{ post.replies?.length }} replies <i class="fas fa-caret-up"></i>
        </button>
        <div class="replies" v-if="post.replies && showReplies" :id="`${post.id}Replies`">
            <Reply v-for="reply in post.replies" :comment="post" :key="post.id" :reply="reply"/>
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
    </div>
</template>
<style scoped>
    .pin {
        float: right;
        margin-left: 0.3em;
    }
    .replies {
        text-align: center;
    }
    .comment-wrapper-wrapper {
        margin-bottom: 1.7em;
    }
    .show-replies-button {
        background: none;
        border: none;
        color: #00bbff;
        font-size: 1.3rem;
        display: block;
        margin: 0 auto;
    }
    .show-replies {
        float: right;
        margin-left: 0.5em;
    }
    form {
        display: none;
        grid-template-columns: 80% 10% 10%;
        align-items: center;
        width: 70%;
        margin: 0 auto;
        padding: 0;
        margin-bottom: 1em;
    }
    form button {
        font-size: 1.3rem;
        background: none;
        border: none;
        color: lightgrey;
    }
    form input {
        width: 100%;
        background: none;
        border: none;
        border-bottom: 1px solid lightgrey;
        color: white;
    }
    .form-group {
        margin-block: 0;
    }
    .submit, .cancel {
        text-align: center;
    }
    .highlighted-comment-header {
        background-color: white;
        color: black;
        display: inline-block;
        font-size: 0.9rem;
        padding: 0.5em;
        font-weight: 500;
        margin: 0em;
        margin-bottom: 0.5em;
    }
    .pinned-comment-header {
        display: inline-block;
        font-size: 1.2rem;
        padding: 0.5em;
        font-weight: 500;
        margin: 0em;
        margin-bottom: 0.5em;
    }
    .pinned-comment-header i {
        margin-right: 0.2em;
    }
    .highlighted {
        outline: 2px solid white;
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
    .pin.pinned .fas.fa-thumbtack {
        color: white;
    }
    .like-button button:hover, .delete:hover {
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
    .show-replies:hover i, .show-replies:hover span {
        color: white;
    }
    .pin:hover {
        color: white;
    }
</style>