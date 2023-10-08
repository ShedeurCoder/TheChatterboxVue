<script setup>
import useChats from '@/composables/useChats'
import useChatPage from '@/composables/useChatPage'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
const { getChats, chatsList } = useChats()
const { chatId } = useChatPage()
const props = defineProps({
    user: Object
})

onMounted(() => {
  getChats(props.user)
})
</script>
<template>
    <div class="sidebar">
        <RouterLink v-for="chat in chatsList"
        :class="chat.id == chatId ? 'current-chat chat-link' : 'chat-link '" :key="chat.id" :to="`/chat/${chat.id}`">
            <h3>{{ chat.users.filter(u => u !== user.username)[0] }}</h3>
        </RouterLink>
    </div>
</template>
<style scoped>
.sidebar {
    position: fixed;
    right: 0;
    top: 0;
    background: black;
    height: 100dvh;
    padding-top: 0.5em;
    width: 15%;
    text-align: center;
    overflow-y: scroll;
}
@media screen and (max-width: 799px) {
    .sidebar {
        display: none;
    }
}
.chat-link {
    display: inline-block;
    font-size: 1dvw;
    border: 1px solid black;
    margin: 0.5em auto;
    padding-block: 0.5em;
    color: white;
    width: 90%;
    text-align: center;
    background: #1d1d1d;
    border-radius: 10px;
}
.chat-link:hover {
    background: #494949;
}
.current-chat {
    background: #7e7d7d;
}
</style>