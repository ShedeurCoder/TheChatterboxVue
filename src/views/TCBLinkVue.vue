<script setup>
import useAuth from '@/composables/useAuth'
import useLink from '@/composables/useLink'
import TCBLinkEditor from '@/components/TCBLinkEditor.vue'
const { userData } = useAuth()
const { createTree } = useLink()
</script>
<template>
    <h1>The Chatterbox Tree</h1>
    <div v-if="userData">
        <div class="create-link-button-container" v-if="!userData.tcblink">
            <p>The Chatterbox Tree is a LinkTree and ChibLink alternative where you can put all your links in an organized fashion.</p>
            <button class='create-link' @click="createTree(userData.username, userData.id, userData.pfp)">Create Tree</button>
        </div>

        <TCBLinkEditor v-else :user="userData"/>
    </div>
    <h2 v-else>You need a TCB account to use TCB Tree</h2>
</template>
<style scoped>
*, *::before, *::after {
    box-sizing: border-box;
}

h1, h2 {
    text-align: center;
}

.create-link-button-container {
    text-align: center;
}
</style>