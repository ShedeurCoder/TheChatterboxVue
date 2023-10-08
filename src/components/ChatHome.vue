<script setup>
import useChats from '@/composables/useChats'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
const { getChats, chatsList, makeChat } = useChats()
const props = defineProps({
    user: Object
})
const usernameInput = ref('')

onMounted(() => {
  getChats(props.user)
})
</script>
<template>
  <div class="new-chat">
    <h2>Start new chat</h2>
    <form @submit.prevent="makeChat(user, usernameInput); usernameInput = ''">
      <input type="text" id="home-post-input" placeholder="Enter username" v-model="usernameInput" autocomplete='off' required maxlength="25" pattern="[a-z0-9_]{2,}">
      <button type="submit">Chat</button>
    </form>
  </div>
  <div class="your-chats">
    <h2>Your Chats</h2>
    <div class="chats-list">
      <RouterLink v-for="chat in chatsList" class="chat-link" :key="chat.id" :to="`/chat/${chat.id}`">
        <h3>{{ chat.users.filter(u => u !== user.username)[0] }}</h3>
      </RouterLink>
    </div>
  </div>
</template>
<style scoped>
.chats-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
  align-items: center;
}
.chat-link {
  border: 1px solid black;
  margin: 0 auto;
  padding-block: 0.5em;
  color: white;
  width: 90%;
  display: inline-block;
  text-align: center;
  background: #303030;
  border-radius: 10px;
}
.chat-link:hover {
  background: #494949;
}
@media only screen and (min-width: 800px) {
  .chats-list {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
h2 {
    text-align: center;
} 
form {
  display: grid;
  grid-template-columns: 95% 5%;
  margin: 1em 2em;
  gap: 0.5em;
}
form input {
  background: none;
  border: none;
  border-bottom: 3px black solid;
  color: white;
  font-size: 1.3rem;
  padding: 0.5em;
}
form button {
  background: #006fe6;
  border: none;
  color: white;
  font-size: 1.1rem;
  overflow: hidden;
  border-radius: 5px;
}
form input:focus {
  outline: 3px rgb(58, 58, 156) solid;
}
</style>