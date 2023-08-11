<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps({
    ticket: Object
})

const date = new Date(props.ticket.createdAt.seconds * 1000)
const readableDate = ref(date.toString().split(' ').splice(1 , 4).join(' '))
</script>
<template>
    <RouterLink class="ticket" :to="`/ticket/${ticket.id}`">
        <div class="ticket-header">
            <h2>@{{ ticket.username }}</h2>
            <small>{{ readableDate }}</small>
        </div>
        <div class="ticket-body">
            <p>{{ ticket.details }}</p>
        </div>
        <div class="ticket-footer">
            <small>Status: {{ ticket.open ? 'open' : 'closed' }}</small>
            <small>|</small>
            <small>Type: {{ ticket.type }}</small>
            <small>|</small>
            <small>Email: {{ ticket.email }}</small>
            <small>|</small>
            <small>Name: {{ ticket.name }}</small>
            <small>|</small>
            <small>Replies: {{ ticket.replies.length }}</small>
        </div>
    </RouterLink>
</template>
<style scoped>
    .ticket {
        display: block;
        margin: 1em auto;
        background: #303030;
        width: 90%;
        max-width: 70ch;
        padding: 1.5em;
        color: white;
        text-decoration: none;
        border-radius: 5px;
    }
    .ticket-footer {
        display: flex;
        justify-content: space-evenly;
    }
    .ticket-header {
        display: grid;
        grid-template-columns: 60% 40%;
        align-items: center;
    }
    .ticket-header small {
        font-size: 1.1rem;
        text-align: right;
    }
    .ticket-body p {
        font-size: 1.3rem;
        margin-bottom: 2em;
    }
</style>