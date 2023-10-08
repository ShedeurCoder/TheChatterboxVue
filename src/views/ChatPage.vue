<script setup>
import ChatPageComponent from '@/components/ChatPageComponent.vue'
import ChatSidebar from '@/components/ChatSidebar.vue'
import useAuth from '@/composables/useAuth'
const { userData } = useAuth()
</script>
<template>
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