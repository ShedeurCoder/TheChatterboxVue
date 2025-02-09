<script setup>
import PostComponent from '@/components/PostComponent.vue'
import useAuth from '@/composables/useAuth'
import usePosts from '@/composables/usePosts'
import { Head } from '@unhead/vue/components'
const { userData, notifsNumber } = useAuth()
const { getSaves, savedPosts } = usePosts()
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}Your Saves - TCB</title>
    </Head>
    <div class="display-none" v-if="userData && savedPosts.length === 0">
        {{ getSaves(userData?.saves) }}
    </div>
    <div class="display-none" v-else-if="!userData && savedPosts.length > 0">
        {{ savedPosts = [] }}
    </div>
    <h1 style="text-align: center;">Saves</h1>
    <div class="profile-posts">
        <PostComponent v-for="post in savedPosts" :post="post"/>
    </div>
</template>