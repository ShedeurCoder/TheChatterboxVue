<script setup>
    import useProfile from "@/composables/useProfile";
    import ProfileHeader from '@/components/ProfileHeader.vue'
    import PostComponent from '@/components/PostComponent.vue'
    import ProfileComment from '@/components/ProfileComment.vue'
    import { useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
    import { ref } from 'vue'
    const { profilePosts, profileData } = useProfile()
    const route = useRoute()
    const path = ref(route.path)

    onBeforeRouteUpdate((to) => {
        path.value = to.path
    })
    onBeforeRouteLeave((to) => {
        path.value = to.path
    })
</script>
<template>
    <ProfileHeader :profileData="profileData" :path="path"/>
    <div class="profile-posts" v-if="path.includes('comments')">
        <ProfileComment v-for="post in profilePosts" :post="post" :key="post.id"/>
    </div>
    <div class="profile-posts" v-else-if="path.includes('likes')">
        <PostComponent v-for="post in profilePosts" :post="post" :key="post.id"/>
    </div>
    <div class='profile-posts' v-else>
        <PostComponent :post="post" v-for="post in profilePosts.filter((c) => c.id === profileData.pinned)" 
            :key='post.id' :pinned='true'/>
        <PostComponent :post="post" v-for='post in profilePosts.filter((c) => c.id !== profileData.pinned)' :key='post.id'/>
    </div>
</template>