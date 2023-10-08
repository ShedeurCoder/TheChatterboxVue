<script setup>
import ChatHome from '../components/ChatHome.vue'
import useAuth from '@/composables/useAuth'
const { userData } = useAuth()
</script>
<template>
    <h1>
        <span>
            <img src="../assets/images/logo.png" alt="TCB Vue">&nbsp;The Chatterbox Chat
        </span>
    </h1>
    <small>This feature is in the beta stage of development. The app may break and changes may happen. Please submit feedback as a ticket.</small>
    <ChatHome v-if="userData" :user="userData"/>
</template>
<style scoped>
h1 img {
    width: 50px;
}
h1 span {
    display: flex;
    align-items: center;
    justify-content: center;
}
h1 {
    text-align: center;
    font-size: 2.5rem;
}
small {
    display: block;
    text-align: center;
}
</style>