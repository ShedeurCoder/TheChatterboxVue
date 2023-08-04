<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="about">
    <RouterLink style="float: right; color: white;" to='/tos'>Terms of Service</RouterLink>
    <div class="about-header">
      <img src='../assets/images/logo.png'>
      <h1>The Chatterbox</h1>
    </div>
    <div class="about-body">
      <div class="why">
        <h2>Why The Chatterbox?</h2>
        <p>The chatterbox is a great way to connect with people. You can say about anything, and you can meet about anyone! In The Chatterbox, we aim to connect us humans, because as technology progresses, so does alone time. We make it easy here at The Chatterbox for everyone to talk! </p>
      </div>

      <div class="story">
        <h2>Our story</h2>
        <p>We started when Shedeur B, our founder, just learned how to do back-end code. He didn't know what to make, so he just made a Twitter lite. A bit over a year later, after Shedeur learned Vue, he created The Chatterbox Vue to practice his Vue skills.</p>
      </div>

      <div class="source-code">
        <h2>Source code</h2>
        <p>Our source code is available to see on GitHub for free. Just go to our <a href="https://github.com/ShedeurCoder/TheChatterboxVue" target="_blank">GitHub Repo</a>, and you can view our source code!</p>
      </div>

      <div class="about-thechatterbox">
        <h2>About The Chatterbox</h2>
        <p>The Chatterbox Social Media Organization was founded June 13, 2022. The first release was on July 4, 2022. The Chatterbox is owned and managed by Chibs Incorporated with Shedeur Bhatkal as the CEO of The Chatterbox. Currently, there is 1 developer for The Chatterbox and 4 admins on The Chatterbox.</p>
        <p>The Chatterbox Vue started development on July 23, 2023 and was first released on July 29, 2023. Just like the original The Chatterbox, it is owned and managed by Chibs Incorporated with Shedeur Bhatkal as CEO. It also has only 1 developer.</p>
      </div>

      <div class="versus">
        <h2>The Chatterbox or The Chatterbox Vue?</h2>
        <p>The original The Chatterbox is not live, and is a full-stack site with many pages and backend code, while using MongoDB as the database.</p>
        <p>The Chatterbox Vue uses VueJS 3 to make it live. It is a single-page application with Firebase as both the backend and the database. Due to this, The Chatterbox and The Chatterbox Vue have completely different databases.</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.about-header {
  display: flex;
  align-items: center;
}
.about-header img {
  width: 100px;
  margin: none;
  margin-right: 1em;
}
h1 {
  font-size: 3rem;
  text-align: left;
  display: inline-block;
}
.about-body div {
  padding: 1.5em;
  margin-inline: 1em;
}
p {
  font-size: 1.3rem;
}
h2 {
  font-size: 2rem;
}
.why {
  background-color: #4d1285;
}
.story {
  background-color: #a1122f;
}
.source-code {
  background-color: #045004;
}
.about-thechatterbox {
  background-color: #015151;
}
.versus {
  background-color: #3f48cb;
}
</style>