<script setup>
    import useProfile from "@/composables/useProfile";
    import ProfileHeader from '@/components/ProfileHeader.vue'
    import PostComponent from '@/components/PostComponent.vue'
    const { profilePosts, profileData } = useProfile()
</script>
<template>
    <ProfileHeader :profileData="profileData"/>
    <div class='profile-posts'>
        <PostComponent :post="post" v-for="post in profilePosts.filter((c) => c.id === profileData.pinned)" 
            :key='post.id' :pinned='true'/>
        <PostComponent :post="post" v-for='post in profilePosts.filter((c) => c.id !== profileData.pinned)' :key='post.id'/>
    </div>
</template>