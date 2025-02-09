<script setup>
import { onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import useLink from '@/composables/useLink'
import { Head } from '@unhead/vue/components'
import useAuth from '@/composables/useAuth'
const { getTree, userTree } = useLink()
const route = useRoute()
let username = route.params.user

onMounted(() => {
    getTree(username)
})
</script>
<template>
    <Head>
        <title>@{{ username }} - TCB Tree</title>
    </Head>
    <section v-if="userTree" :style="`background: ${userTree.bg}; color: ${userTree.color}`">
        <div class="tcb-link" v-if="userTree.username">
            <RouterLink :to="`/@${userTree.username}`" class="tcb-link-link" :style="`color: ${userTree.color}`">
                &larr; TCB Profile
            </RouterLink>
        </div>
        <div class="tree-header">
            <img class="pfp"
            :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${userTree?.pfp || 'defaultProfile_u6mqts'}`"><br>
            <h1>@{{ userTree?.username }}</h1>
            <p>
                {{ userTree?.desc }}
            </p>
        </div>
        <div class="tree-links">
            <a target="_blank" class="link" 
            v-for="(link, index) in userTree.links"
            :style="`color: ${link.color}; background: ${link.bg}; animation-delay: ${index * 40}ms`"
            :href="link.url">
                <b class="link-title">{{ link.title }}</b>
            </a>
        </div>
    </section>
</template>
<style scoped>
* {
    box-sizing: border-box;
}

h1 {
    font-size: 2rem;
    display: inline;
}

p {
    font-size: 1.2rem;
}

section {
    width: 100dvw;
    left: 0;
    top: 0;
    bottom:0;
    position:fixed;
    overflow-y:scroll;
    overflow-x:hidden;
}

.pfp {
    width: 100px;
}

.tree-header {
    text-align: center;
    margin: 2em;
}

.tree-links {
    text-align: center;
    max-width: 60dvw;
    margin: 0 auto;
}

.link {
    display: block;
    font-size: 1.5rem;
    text-decoration: none;
    padding: 0.8em;
    margin-block: 0.7em;
    transform: translateY(60px);
    filter: blur(10%);
    opacity: 40%;
    animation: fadeUp 1s forwards;
    font-weight: 300;
}

.tcb-link {
    margin: 1rem;
}

.tcb-link-link {
    opacity: 90%;
    font-size: 1.1rem;
    text-decoration: none;
}

.tcb-link-link:hover {
    text-decoration: underline;
}

@keyframes fadeUp {
    to {
        transform: translateY(0);
        filter: blur(0);
        opacity: 100%;
    }
}
</style>