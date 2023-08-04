<script setup>
import Comment from '@/components/Comment.vue'
import { ref } from 'vue'
import usePostPage from '@/composables/usePostPage'
import useAuth from '@/composables/useAuth'
import PostViewComponent from '@/components/PostViewComponent.vue'
const { userData } = useAuth()
const { postData, createComment, comments } = usePostPage()

const replyInput = ref('')
</script>
<template>
    <PostViewComponent :postData="postData" :userData="userData" v-if="postData"/>

    <form class="reply-form" @submit.prevent="createComment(replyInput, userData.username, postData?.id, postData?.comments, userData.pfp); replyInput = ''">
        <input type="text" v-model="replyInput" placeholder="Create a comment" v-if="userData" required>
        <input type="text" value="Login to comment" disabled v-else>
        <button type="submit" v-if="userData && postData">Comment</button>
        <button type="button" v-else>Comment</button>
    </form>

    <div class='profile-posts'>
        <Comment :post="comment" v-for='comment in comments' :key='comment.id' :postComments='postData?.comments'/>
    </div>
</template>
<style scoped>
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