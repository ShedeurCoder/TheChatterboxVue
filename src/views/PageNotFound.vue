<script setup>
import { Head } from '@unhead/vue/components'
</script>
<template>
    <Head>
        <title>404 Page Not Found!</title>
    </Head>
    <img src="../assets/images/404logo.png">
    <h3>oh no its a 404! go back <a href="/">home!</a></h3>
</template>
<style scoped>
img {
    display: block;
    margin: 0 auto;
    width: 250px;
}
h3 {
    text-align: center;
    font-size: 2rem;
}
</style>