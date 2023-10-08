<script setup>
import useRandom from '@/composables/useRandom'
import useChatPage from '@/composables/useChatPage'
const { deleteMessage } = useChatPage()
const { styleDate } = useRandom()
const props = defineProps({
    message: Object,
    user: Object
})
</script>
<template>
    <div class="other-message message" v-if="message.user !== user.username">
        <div class="header">
            <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${message?.pfp || 'defaultProfile_u6mqts'}`">
            <h3>&nbsp;@{{ message.user }}</h3>
            <small>{{ styleDate(message.createdAt).replace('Today at ', '') }}</small>
        </div>
        <p>{{ message.text }}</p>
    </div>
    <div class="your-message message" v-else>
        <div class="header">
            <small>{{ styleDate(message.createdAt).replace('Today at ', '') }}</small>
            <h3>@{{ message.user }}&nbsp;</h3>
            <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${message?.pfp || 'defaultProfile_u6mqts'}`">
        </div>
        <p>{{ message.text }}</p>
        <button class="delete-message" @click='deleteMessage(message.id)'><i class="fas fa-trash"></i></button>
    </div>
</template>
<style scoped>
.pfp {
    width: 40px;
    height: 40px;
}
.message {
    width: 60%;
    margin: 1em;
    border-radius: 20px;
    padding: 0.5em 1em;
    position: relative;
}
.other-message {
    background: #303030;
}
.your-message {
    text-align: right;
    margin-left: 28%;
    background-color: rgb(100, 5, 100);
    background: linear-gradient(to bottom left, rgb(118, 6, 118), rgb(155, 2, 155));
}
@media only screen and (max-width: 799px) {
    .your-message {
        margin-left: 35%
    }
}
.message .header {
    display: flex;
    position: relative;
    align-items: center;
    z-index: 0;
}
.your-message .header {
    justify-content: end;
}
small {
    position: absolute;
    right: 1%;
}
.your-message small {
    left: 1%;
    right: initial;
}
h3 {
    font-size: 1rem;
}
p {
    font-size: 1.2rem;
}
.delete-message {
    position: absolute;
    left: 1em;
    bottom: 1em;
    border: none;
    font-size: 1rem;
    background: none;
    color: rgb(199, 199, 199);
}
.delete-message:hover {
    color: red;
}
</style>