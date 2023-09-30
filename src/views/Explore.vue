<script setup>
import PostComponent from '@/components/PostComponent.vue'
import useHomePosts from '@/composables/useHomePosts'
import { onMounted, onUnmounted } from 'vue'
const { posts, explore, removePosts } = useHomePosts()
onMounted(() => {
    explore()
})
onUnmounted(() => {
    removePosts()
})
</script>
<template>
  <h1>Explore</h1>
  <button @click="removePosts(); explore()">Refresh</button>
  <div class='home-posts'>
    <PostComponent :post="post" v-for='post in posts' :key='post.id'/>
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