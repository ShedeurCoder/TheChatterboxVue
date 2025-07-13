<script setup>
    import useProfile from "@/composables/useProfile";
    import ProfileHeader from '@/components/ProfileHeader.vue'
    import PostComponent from '@/components/PostComponent.vue'
    import ProfileComment from '@/components/ProfileComment.vue'
    import { useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
    import { ref } from 'vue'
    import { Head } from '@unhead/vue/components'
    import useAuth from '@/composables/useAuth'
    const { notifsNumber, userData } = useAuth()
    const { profilePosts, profileData } = useProfile()
    const route = useRoute()
    const path = ref(route.path)
    const showBlocked = ref(false)

    onBeforeRouteUpdate((to) => {
        path.value = to.path
    })
    onBeforeRouteLeave((to) => {
        path.value = to.path
    })
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}@{{ route.params.username }}{{ (path.includes('comments') || path.includes('likes')) ? (path.includes('comments') ? "'s comments" : "'s likes") : '' }} on TCB</title>
    </Head>
    <div :style="profileData?.secondaryBg ? `background-color: ${profileData?.secondaryBg}` : ''" class="container">
        <ProfileHeader :profileData="profileData" :path="path"/>
        <div class="blockedYou" v-if="userData?.blockedBy?.includes(profileData?.username)">
            You have been blocked by this user. You cannot interact with them.
        </div>
        <span v-if="!userData?.blocked?.includes(profileData?.username)">
            <div class="profile-posts" v-if="path.includes('comments')">
                <ProfileComment v-for="post in profilePosts" :post="post" :key="post.id" :profile="profileData" :blockedBy="userData?.blockedBy?.includes(post?.username)"/>
            </div>
            <div class="profile-posts" v-else-if="path.includes('likes')">
                <PostComponent v-for="post in profilePosts" :post="post" :key="post.id" :profile="profileData" :blocked="userData?.blocked?.includes(post?.username)" :blockedBy="userData?.blockedBy?.includes(post?.username)"/>
            </div>
            <div class='profile-posts' v-else>
                <PostComponent :post="post" v-for="post in profilePosts.filter((c) => c.id === profileData.pinned)" 
                    :key='post.id' :pinned='true' :profile="profileData" :blockedQuote="userData?.blocked?.includes(post?.quotedUsername)" :blockedBy="userData?.blockedBy?.includes(post?.username)"/>
                <PostComponent :post="post" v-for='post in profilePosts.filter((c) => c.id !== profileData.pinned)' :key='post.id' :profile="profileData" :blockedQuote="userData?.blocked?.includes(post?.quotedUsername)" :blockedBy="userData?.blockedBy?.includes(post?.username)"/>
            </div>
        </span>
        <span v-else>
            <h2 class="you-blocked">You blocked this user <button @click="showBlocked = !showBlocked"><span>{{ showBlocked ? ('Hide') : ('Show') }}</span> posts</button></h2>
            <span v-if="showBlocked">
                <div class="profile-posts" v-if="path.includes('comments')">
                    <ProfileComment v-for="post in profilePosts" :post="post" :key="post.id" :profile="profileData"/>
                </div>
                <div class="profile-posts" v-else-if="path.includes('likes')">
                    <PostComponent v-for="post in profilePosts" :post="post" :key="post.id" :profile="profileData" :blocked="userData?.blocked?.includes(post?.username)"/>
                </div>
                <div class='profile-posts' v-else>
                    <PostComponent :post="post" v-for="post in profilePosts.filter((c) => c.id === profileData.pinned)" 
                        :key='post.id' :pinned='true' :profile="profileData" :blockedQuote="userData?.blocked?.includes(post?.quotedUsername)"/>
                    <PostComponent :post="post" v-for='post in profilePosts.filter((c) => c.id !== profileData.pinned)' :key='post.id' :profile="profileData" :blockedQuote="userData?.blocked?.includes(post?.quotedUsername)"/>
                </div>
            </span>
        </span>
    </div>
</template>
<style scoped>
.container {
    padding-bottom: 1em;
}
.you-blocked {
    text-align: center;
}
.you-blocked button {
    background: red;
    border: none;
    color: white;
    padding: 10px;
    border-radius: 10px;
    font-weight: bold;
}
.blockedYou {
    text-align: center;
    background: black;
    font-size: 1.3rem;
    margin: 10px;
    padding: 20px;
}
</style>