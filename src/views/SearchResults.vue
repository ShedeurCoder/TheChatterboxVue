<script setup>
import useSearch from '@/composables/useSearch'
import PostComponent from '@/components/PostComponent.vue'
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { Head } from '@unhead/vue/components'
import useAuth from '@/composables/useAuth'
const { notifsNumber } = useAuth()
const { usersResult, postsResult, queryBoth, unsubscribe } = useSearch()
const route = useRoute()
const searchFormData = ref(route.query.q)
const router = useRouter()

watch(() => route.query.q, (newVal, oldVal) => {
    unsubscribe.value()
    queryBoth()
}, {immediate:true, deep: true})

onMounted(() => {
    queryBoth()
})
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}Search - TCB</title>
    </Head>
    <h1>Search results</h1>
    <input type="text" id="search-input" placeholder="Search" v-model="searchFormData" 
    autocomplete='off' required maxlength="1000" @keyup="router.push({ path: '/search', query: { q: searchFormData } })">
    <div class="results">
        <div class="posts">
            <h2>Posts</h2>
            <PostComponent v-for="post in postsResult" :post="post" :key="post.id"/>
        </div>
        <div class="users">
            <h2>Users</h2>
            <RouterLink :to="`/@${result.username}`" class="search-result" v-for="(result) in usersResult" :key="result.username">
                <img class="pfp" :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${result?.pfp || 'defaultProfile_u6mqts'}`">
                <h2>@{{ result.username }}</h2>
            </RouterLink>
        </div>
    </div>
</template>
<style scoped>
.results {
    display: grid;
    grid-template-columns: 65% 35%;
}
@media only screen and (max-width: 500px) {
    .results {
        grid-template-columns: 1fr;
    }
    .pfp {
        width: 40px;
        height: 40px;
    }
}
#search-input {
    background: none;
    border: none;
    border-bottom: 3px black solid;
    color: white;
    font-size: 1.3rem;
    padding: 0.5em;
    width: 90%;
    display: block;
    margin: 0 auto;
}
h1,
.results > div > h2 {
    text-align: center;
}

.users .search-result h2 {
  font-size: 1.3rem;
  color: white;
  text-decoration: none;
  display: inline;
}
.users .search-result {
  background: #1c1c1c;
  display: flex;
  align-items: center;
  margin: 0.5em;
  padding: 1em;
}
.pfp {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  display: inline;
  margin-right: 10px;
}
</style>