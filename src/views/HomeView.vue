<script setup>
import PostComponent from '@/components/PostComponent.vue'
import useHomePosts from '@/composables/useHomePosts'
import useAuth from '@/composables/useAuth'
const { userData } = useAuth()
const { posts, getPosts } = useHomePosts()
</script>

<template>
  <div class="display-none" v-if="userData && !posts">
    {{ getPosts(userData?.following) }}
  </div>
  <h1>Home</h1>
  <div class='home-posts' v-if="userData && userData.following.length > 0">
    <PostComponent :post="post" v-for='post in posts' :key='post.id'/>
  </div>
  <div class="no-user" v-else-if="userData && !(userData.following.length > 0)">
    <h2>Follow people to see posts. Maybe follow <a href="/@shad">@shad</a> or <a href="/@thechatterbox">@thechatterbox</a>.</h2>
  </div>
  <div class="no-user" v-else-if="!userData">
    <h2>Sign in to see posts from people you're following</h2>
  </div>
</template>

<style>
.display-none {
  display: none;
}
h1 {
  text-align: center;
  font-size: 2.5rem;
}
.no-user h2 {
  text-align: center;
}
.no-user h2 a {
  color: blue;
}
</style>