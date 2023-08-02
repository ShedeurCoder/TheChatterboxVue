<script setup>
    import useProfile from "@/composables/useProfile";
    import ProfileHeader from '@/components/ProfileHeader.vue'
    import PostComponent from '@/components/PostComponent.vue'
    const { profilePosts } = useProfile()
</script>
<template>
    <ProfileHeader/>
    <div class='profile-posts'>
        <PostComponent :post="post" v-for='post in profilePosts' :key='post.id'/>
    </div>
</template>