<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue';
import useAuth from '@/composables/useAuth'
import usePosts from '@/composables/usePosts'
import { ref } from "vue";
const { userData } = useAuth()
const { makePost, postMessage } = usePosts()
const postFormData = ref('')
</script>

<template>
  <AppHeader/>
  <main>
    <RouterView />
    <button v-if="userData" class="new-post" onclick='document.getElementById("postModal").showModal()'><i class='fas fa-plus-circle'></i></button>
  </main>

  <dialog id="postModal" v-if='userData'>
      <p v-if="postMessage">{{ postMessage }}</p>
      <div class='modal-header'>
          <h2>Create post</h2>
          <button class='close-modal' onclick="document.getElementById('postModal').close()">&times;</button>
      </div>
      <form class="sign-in-form" onsubmit="document.getElementById('postModal').close()" @submit.prevent="makePost(postFormData, userData.username, userData.pfp, userData.verified); postFormData = ''">
          <div class="form-group">
              <label for="message">Message:</label>
              <textarea id="message" v-model="postFormData" placeholder="What's up?" required rows="10" maxlength="1000"></textarea>
          </div>
          <button type='submit' class='login-signup'>Post</button>
      </form>
  </dialog>
</template>
<style scoped>
  .new-post {
    position: fixed;
    bottom: 10dvh;
    right: 0;
    border: none;
    background: #007bff;
    color: white;
    border-radius: 50%;
    padding: 1.05em;
  }
  .new-post i {
    font-size: 2rem;
  }
  @media only screen and (min-width: 800px) {
    .new-post {
      bottom: 0;
    }
  }
</style>