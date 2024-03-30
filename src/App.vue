<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue';
import useAuth from '@/composables/useAuth'
import usePosts from '@/composables/usePosts'
import { ref } from "vue";
import { useRoute } from 'vue-router'
const { userData } = useAuth()
const { makePost, postMessage } = usePosts()
const postFormData = ref({
  message: '',
  image: '',
  imageName: ''
})
const route = useRoute()

const widget = window.cloudinary.createUploadWidget(
  {cloud_name: 'dmftho0cx', upload_preset: 'chatterbox-vue', sources: ['local', 'url']},
  (err, result) => {
    if (!err && result && result.event === 'success') {
      postFormData.value.image = result.info.public_id
      postFormData.value.imageName = `${result.info.original_filename}.${result.info.format}`
      document.getElementById("postModal").showModal()
      closeUploadWidget()
    }
  }
)

function openUploadWidget() {
  widget.open()
}

function closeUploadWidget() {
  widget.close()
}
</script>

<template>
  <AppHeader v-if="!route.path.startsWith('/t/')"/>
  <main id="main">
    <RouterView />
    <button v-if="userData && !route.path.startsWith('/chat') && !route.path.startsWith('/t/')" class="new-post" onclick='document.getElementById("postModal").showModal()'><i class='fas fa-plus-circle'></i></button>
  </main>

  <dialog id="postModal" v-if='userData'>
      <p v-if="postMessage">{{ postMessage }}</p>
      <div class='modal-header'>
          <h2>Create post</h2>
          <button class='close-modal' onclick="document.getElementById('postModal').close()">&times;</button>
      </div>
      <form class="sign-in-form" onsubmit="document.getElementById('postModal').close()" 
      @submit.prevent="makePost(postFormData.message, userData.username, userData.pfp, userData.verified, postFormData.image);
      postFormData.message = ''; postFormData.image = ''; postFormData.imageName = ''">
          <div class="form-group">
              <label for="message">Message:</label>
              <textarea id="message" v-model="postFormData.message" placeholder="What's up?" required rows="7" maxlength="1000"></textarea>
          </div>
          <div class="upload">
            <button type="button" class="add-image" @click="openUploadWidget()"
            onclick="document.getElementById('postModal').close()">Upload image</button>
            <span>&nbsp;{{ postFormData.imageName }}</span>
          </div>
          <button type='submit' class='login-signup'>Post</button>
      </form>
  </dialog>
</template>
<style scoped>
  .upload {
    padding: 1em;
  }
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