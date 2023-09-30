<script setup>
import PostComponent from '@/components/PostComponent.vue'
import useAuth from '@/composables/useAuth'
import usePosts from '@/composables/usePosts'
const { userData } = useAuth()
const { getSaves, savedPosts } = usePosts()
</script>
<template>
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