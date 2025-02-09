<script setup>
import ChatPageComponent from '@/components/ChatPageComponent.vue'
import ChatSidebar from '@/components/ChatSidebar.vue'
import useAuth from '@/composables/useAuth'
import { Head } from '@unhead/vue/components'

const { userData, notifsNumber } = useAuth()
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}Chat on TCB</title>
    </Head>
    <div class="chat-page">
        <ChatPageComponent v-if="userData" :user="userData" class="chat-component"/>
        <ChatSidebar :user="userData" v-if="userData"/>
    </div>
</template>
<style scoped>
@media only screen and (min-width: 800px) {
    .chat-page {
        display: grid;
        grid-template-columns: 90% 15%;
    }
}
</style>