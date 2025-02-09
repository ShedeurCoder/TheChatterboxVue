<script setup>
    import useProfile from "@/composables/useProfile";
    import ProfileHeader from '@/components/ProfileHeader.vue'
    import PostComponent from '@/components/PostComponent.vue'
    import ProfileComment from '@/components/ProfileComment.vue'
    import { useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'
    import { ref } from 'vue'
    import { Head } from '@unhead/vue/components'
    import useAuth from '@/composables/useAuth'
    const { notifsNumber } = useAuth()
    const { profilePosts, profileData, updateAmount } = useProfile()
    const route = useRoute()
    const path = ref(route.path)
    let loadComments = 50
    let loadLikes = 50

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
        <div class="profile-posts" v-if="path.includes('comments')">
            <ProfileComment v-for="post in profilePosts" :post="post" :key="post.id" :profile="profileData"/>
            <div class="load-div">
                <button @click="loadComments+=50; updateAmount(loadComments)" class="load-more">Load more</button>
            </div>
        </div>
        <div class="profile-posts" v-else-if="path.includes('likes')">
            <PostComponent v-for="post in profilePosts" :post="post" :key="post.id" :profile="profileData"/>
            <div class="load-div">
                <button @click="loadLikes+=50; updateAmount(loadLikes)" class="load-more">Load more</button>
            </div>
        </div>
        <div class='profile-posts' v-else>
            <PostComponent :post="post" v-for="post in profilePosts.filter((c) => c.id === profileData.pinned)" 
                :key='post.id' :pinned='true' :profile="profileData"/>
            <PostComponent :post="post" v-for='post in profilePosts.filter((c) => c.id !== profileData.pinned)' :key='post.id' :profile="profileData"/>
        </div>
    </div>
</template>
<style scoped>
.load-div {
  text-align: center;
  margin-bottom: 0.5em;
}
.load-more {
  background: rgb(0, 110, 255);
  color: white;
  border: none;
  padding: 0.7em;
  font-size: 1.2em;
  border-radius: 10px;
}
.container {
    padding-bottom: 1em;
}
</style>