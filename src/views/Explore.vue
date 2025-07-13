<script setup>
import PostComponent from '@/components/PostComponent.vue'
import useHomePosts from '@/composables/useHomePosts'
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Head } from '@unhead/vue/components'
import useAuth from '@/composables/useAuth'
const { notifsNumber, userData } = useAuth()
const route = useRoute()
const { posts, explore, removePosts } = useHomePosts()
onMounted(() => {
  explore()
})
onUnmounted(() => {
    removePosts()
})
</script>
<template>
  <Head>
    <title v-if="route.path === '/explore'">{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}Explore - TCB</title>
  </Head>
  <h1 v-if="route.path === '/explore'">Explore</h1>
  <button @click="removePosts(); explore()">Refresh posts</button>
  <div class='home-posts'>
    <span v-for='post in posts' :key='post.id'>
      <PostComponent :post="post" v-if='!userData?.blocked?.includes(post?.username) && !userData.blockedBy?.includes(post?.username)' :blockedQuote="userData?.blocked?.includes(post?.quotedUsername)"/>
    </span>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  font-size: 2.5rem;
}
button {
  position: fixed;
  top: 0;
  right: 0;
  background-color: #006fe6;
  color: white;
  border: none;
  font-size: 1.1rem;
  padding: 0.3em;
}
</style>