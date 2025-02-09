<script setup>
import ChatHome from '../components/ChatHome.vue'
import useAuth from '@/composables/useAuth'
import { Head } from '@unhead/vue/components'
const { userData, closeDm, openDm, notifsNumber } = useAuth()
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}The Chatterbox Chat</title>
    </Head>
    <button v-if="userData && userData?.dm === false" class="dm-switch" @click="openDm(userData)">
        Open DM's
    </button>
    <button v-else-if="userData && (userData?.dm ?? true)" class="dm-switch" @click="closeDm(userData)">
        Close DM's
    </button>
    <h1>
        <span>
            <img src="../assets/images/logo.png" alt="TCB Vue">&nbsp;The Chatterbox Chat
        </span>
    </h1>
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
.dm-switch {
    position: absolute;
    top: 0;
    right: 0;
}
</style>