<script setup>
import PostComponent from '@/components/PostComponent.vue'
import useHomePosts from '@/composables/useHomePosts'
import useAuth from '@/composables/useAuth'
import usePosts from '@/composables/usePosts'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
const { userData } = useAuth()
const { posts, getPosts, queryUser, searchResult, removePosts } = useHomePosts()
const searchData = ref('')
const { makePost } = usePosts()
const postFormData = ref('')
</script>
<template>
  <div class="right-bar">
    <div class="search-user">
      <input type="search" v-model='searchData' @keyup="queryUser(searchData)" class="search-input" placeholder="🔍 Search">
      <div class="search-results">
        <RouterLink :to="`/@${result.username}`" class="search-result" v-for="(result) in searchResult" :key="result.username">
          <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${result?.pfp || 'defaultProfile_u6mqts'}`">
          <h2>@{{ result.username }}</h2>
        </RouterLink>
      </div>
    </div>
    <div class="legal">
      Copyright Chibs Inc. 2023
      <RouterLink to="/about">About The Chatterbox</RouterLink> <br>
      <RouterLink to="/tos">Terms of Service</RouterLink>
      <RouterLink to="/privacy">Privacy Policy</RouterLink>
    </div>
  </div>
  <div class="display-none" v-if="userData && userData?.following.length > 0 && posts?.length === 0">
    {{ getPosts(userData?.following) }}
  </div>
  <div class="display-none" v-if="!userData && posts?.length > 0">
    {{ removePosts() }}
  </div>
  <h1>Home</h1>
  <div class="new-post" v-if='userData'>
    <form @submit.prevent="makePost(postFormData, userData.username, userData.pfp, userData.verified); postFormData = ''">
      <input type="text" id="home-post-input" placeholder="Talk about something" v-model="postFormData" autocomplete='off' required maxlength="1000">
      <button type="submit">Post</button>
    </form>
  </div>
  <div class='home-posts' v-if="userData && userData.following.length > 0">
    <PostComponent :post="post" v-for='post in posts' :key='post.id'/>
  </div>
  <div class="no-user" v-else-if="userData && !(userData.following.length > 0)">
    <h2>Follow people to see posts. Maybe follow <RouterLink to="/@shad" class="nav-link">@shad</RouterLink> or <RouterLink to="/@thechatterbox" class="nav-link">@thechatterbox</RouterLink>.</h2>
  </div>
  <div class="no-user" v-else-if="!userData">
    <h2>Sign in to see posts from people you're following</h2>
  </div>
</template>

<style scoped>
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
.right-bar {
  position: fixed;
  top: 0;
  right: 0;
  text-align: right;
}
.search-results {
  background: black;
  padding: 1em;
  border-radius: 10px;
  overflow: scroll;
}
.search-user h2 {
  font-size: 1rem;
  color: white;
  text-decoration: none;
  display: inline;
}
.search-result {
  background: #1c1c1c;
  display: flex;
  align-items: center;
  margin: 0.5em;
  padding: 1em;
}
.pfp {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  display: inline;
  margin-right: 10px;
}
.search-input {
  background: #1c1c1c;
  color: white;
  font-size: 1.3rem;
  border: none;
  padding: 0.3em;
  margin: 0.2em;
  border-radius: 5px;
}
.search-results {
  display: none;
  overflow: scroll;
  max-height: 80dvh;
}
.search-user:focus-within .search-results {
  display: block;
}
.new-post form {
  display: grid;
  grid-template-columns: 95% 5%;
  margin: 1em 2em;
  gap: 0.5em;
}
.new-post input {
  background: none;
  border: none;
  border-bottom: 3px black solid;
  color: white;
  font-size: 1.3rem;
  padding: 0.5em;
}
.new-post button {
  background: #006fe6;
  border: none;
  color: white;
  font-size: 1.1rem;
  overflow: hidden;
  border-radius: 5px;
}
.new-post input:focus {
  outline: 3px rgb(58, 58, 156) solid;
}
.legal {
  font-size: 0.7rem;
}
.legal a {
  color: rgb(255, 255, 255, 0.8);
  margin-inline: 0.1em;
}
.legal a:hover {
  color: white;
}
</style>