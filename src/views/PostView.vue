<script setup>
import Comment from '@/components/Comment.vue'
import { ref } from 'vue'
import usePostPage from '@/composables/usePostPage'
import useAuth from '@/composables/useAuth'
import PostViewComponent from '@/components/PostViewComponent.vue'
import { Head } from '@unhead/vue/components'
const { userData, notifsNumber } = useAuth()
const { postData, createComment, comments, highlightedComment } = usePostPage()

const replyInput = ref('')
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}{{ postData ? `@${postData.username}` : 'Post' }} on TCB{{ postData ? `: "${postData.message}"` : '' }}</title>
    </Head>

    <PostViewComponent :postData="postData" :userData="userData" v-if="postData"/>

    <form class="reply-form" @submit.prevent="createComment(replyInput, userData.username, postData?.id, postData?.comments, userData.pfp, postData?.username, userData?.verified); replyInput = ''">
        <input type="text" v-model="replyInput" placeholder="Create a comment" v-if="userData && !userData?.blockedBy?.includes(postData?.username)" required maxlength="500">
        <input type="text" value="You have been blocked by this user. You may not comment." disabled v-else-if="userData?.blockedBy?.includes(postData?.username)">
        <input type="text" value="Login to comment" disabled v-else>
        <button type="submit" v-if="userData && postData && !userData?.blockedBy?.includes(postData?.username)">Comment</button>
        <button type="button" v-else>Comment</button>
    </form>

    <div class='profile-posts'>
        <Comment :post="comment" v-for='comment in comments.filter((c) => c.id === postData?.pinned)' :postData="postData" :key='comment.id' :pinned="true" :blockedBy="userData?.blockedBy?.includes(comment.username)"/>
        <Comment :post="comment" v-for='comment in comments.filter((c) => c.id === highlightedComment && c.id !== postData?.pinned)' :postData="postData" :key='comment.id' :highlighted="true" :blockedBy="userData?.blockedBy?.includes(comment.username)"/>
        <Comment :post="comment" v-for='comment in comments.filter((c) => c.id !== highlightedComment && c.id !== postData?.pinned)' :postData="postData" :key='comment.id' :blockedBy="userData?.blockedBy?.includes(comment.username)"/>
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