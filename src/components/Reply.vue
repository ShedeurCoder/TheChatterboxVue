<script setup>
import useAuth from '@/composables/useAuth'
import usePostPage from '@/composables/usePostPage'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const { deleteReply } = usePostPage()
const { userData } = useAuth()
const props = defineProps({
    reply: Object,
    comment: Object
})
const date = new Date(props.reply.createdAt.seconds * 1000)
const readableDate = ref(date.toString().split(' ').splice(1, 3).join(' '))

if (readableDate.value == Date().toString().split(' ').splice(1, 3).join(' ')) {
    readableDate.value = date.toString().split(' ').splice(4, 1).join(' ').split(':').splice(0, 2).join(':')

    const [hourString, minute] = readableDate.value.split(":");
    const hour = +hourString % 24;
    readableDate.value = 'Today at ' + (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM")
}
</script>
<template>
    <div class='comment-wrapper'>
        <div class="comment-header">
            <small>{{ readableDate }}</small>
            <RouterLink :to="`/@${reply.username}`" style='text-decoration: none;' class="comment-user-link">
                <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${reply?.pfp || 'defaultProfile_u6mqts'}`">
                <h2>
                    @{{ reply.username }}
                    <i v-if='reply.verified' class='fas fa-check-circle'></i>
                </h2>
            </RouterLink>
        </div>
        <div class="comment-body">
            <p>{{ reply.message }}</p>
        </div>
        <div class="comment-footer">
            <button type="button" v-if='userData?.username === reply.username || userData?.admin' 
            @click="deleteReply(reply.id, comment, reply.username)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    </div>
</template>
<style scoped>
.comment-wrapper::after {
    content: "";
    clear: both;
    display: table;
}
.comment-footer button:hover {
    color: rgb(205, 12, 12)
}
.comment-footer button {
    font-size: 1.3rem;
    color: rgb(218, 218, 218);
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
    background: none;
    border: none;
    float: left;
}
.comment-wrapper {
    width: 70%;
    max-width: 65ch;
    margin: 1em auto;
    background-color: #303030;
    padding: 2em;
    border-radius: 20px;
    padding-top: 1em;
}
p {
    text-align: left;
}
.comment-user-link {
    display: flex;
    align-items: center;
}
.comment-wrapper h2 {
    color: white;
    display: inline;
    font-size: 1.3rem;
}
.comment-header small {
    font-size: 1.1rem;
    float: right;
    margin-top: 1em;
}
.comment-header {
    margin-bottom: 1em;
}
.comment-body {
    color: white;
    font-size: 1.3rem;
}
.pfp {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    display: inline;
    margin-right: 10px;
}
</style>