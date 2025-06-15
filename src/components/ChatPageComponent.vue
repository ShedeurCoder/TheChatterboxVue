<script setup>
import useChatPage from '@/composables/useChatPage'
import Message from '@/components/Message.vue'
import { ref, watch } from 'vue'
import { Head } from '@unhead/vue/components'
import useAuth from '@/composables/useAuth'
const { notifsNumber } = useAuth()
const { chatData, newMessage, messagesArray } = useChatPage()
const props = defineProps({
    user: Object
})
const messageInput = ref('')
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}Chat {{ chatData?.users ? `with @${chatData.users.filter(u => u !== user.username)[0]}` : 'on TCB'}}</title>
    </Head>
    <div class="chat" v-if="chatData">
        <div v-if="chatData.users && chatData.users.includes(user.username)">
            <Message :user="user" :message="message" v-for="message in messagesArray" v-if="messagesArray" :key="message.id"/>
            <form class="message-form" @submit.prevent="newMessage(user, messageInput, chatData.id, chatData.users.filter(u => u !== user.username)[0]); messageInput = ''"
            onsubmit="">
                <a class="scroll-down" href="#scrollTo"><i class="fas fa-caret-down"></i></a>
                <input type="text" v-model="messageInput" autocomplete="off" placeholder="Message..." required>
                <button type="submit">Send</button>
            </form>
            <div id="scrollTo"></div>
        </div>
        <div v-else>
            <h1>This chat doesn't exist or you do not have access to it.</h1>
        </div>
    </div>
</template>
<style scoped>
.chat {
    margin-bottom: 8dvh;
}
@media only screen and (max-width: 799px) {
    .chat {
        margin-bottom: 20dvh;
    }
}
form {
    position: fixed;
    bottom: 0.5em;
    width: 75%;
    display: flex;
    justify-content: center;
}
input {
    background-color: #2b2b2b;
    border: 2px solid #000;
    border-radius: 20px;
    color: #fff;
    font-size: 1.3rem;
    padding: .4em;
    width: 80%;
}
button {
    background-color: #252525;
    border: none;
    border-radius: 20px;
    color: #bfbebe;
    cursor: pointer;
    font-size: 1.3rem;
    margin-left: 10px;
    padding: .4em;
    width: 12%;
}
@media only screen and (max-width: 799px) {
    form {
        bottom: calc(10dvh + 0.5em);
        width: 100%;
    }
}
.scroll-down {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-right: 0.3em;
    border-radius: 50%;
    background: #191919; 
    color: white;
    text-decoration: none;
    font-size: 1rem;
}
</style>