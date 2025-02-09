<script setup>
import { Head } from '@unhead/vue/components'
import { ref, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import useTickets from '@/composables/useTickets'
import useAuth from '@/composables/useAuth'
const { userData, notifsNumber } = useAuth()
const { ticketData, createComment, getTicket, unsubscribeFromTicket, closeTicket } = useTickets()
const route = useRoute()

const replyInput = ref('')

onMounted(() => {
    getTicket(route.params.ticket)
})

onBeforeRouteUpdate((to) => {
    unsubscribeFromTicket.value()
    getTicket(to.params.post)
})
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}Ticket on TCB</title>
    </Head>
    <div v-if="ticketData?.username === userData?.username || userData?.admin">
        <section class="ticket">
            <div class="ticket-header">
                <h2>@{{ ticketData?.username }}</h2>
                <small>{{ new Date(ticketData?.createdAt.seconds * 1000).toString().split(' ').splice(1 , 4).join(' ') }}</small>
            </div>
            <div class="ticket-body">
                <p>{{ ticketData?.details }}</p>
            </div>
            <hr>
            <br>
            <div class="ticket-footer">
                <small>Status: {{ ticketData?.open ? 'open' : 'closed' }}</small>
                <small>|</small>
                <small>Type: {{ ticketData?.type }}</small>
                <small>|</small>
                <small>Email: {{ ticketData?.email }}</small>
                <small>|</small>
                <small>Name: {{ ticketData?.name }}</small>
                <small>|</small>
                <small>Replies: {{ ticketData?.replies.length }}</small>
                <small v-if="ticketData?.open">|</small>
                <button @click="closeTicket(route.params.ticket)" v-if="ticketData?.open">Close ticket</button>
            </div>
        </section>
    
        <form class="reply-form" v-if="ticketData?.open"
        @submit.prevent="createComment(ticketData, replyInput, userData); replyInput = ''">
            <input type="text" v-model="replyInput" placeholder="Reply to this ticket" v-if="userData" required>
            <button type="submit">Comment</button>
        </form>

        <section class="replies">
            <div class='comment-wrapper' v-for="(reply, index) in ticketData?.replies" :key="index">
                <div class="comment-header">
                    <h2>
                        @{{ reply.username }}
                        <small v-if='reply.admin'>Admin</small>
                    </h2>
                    <small>{{ new Date(reply.createdAt.seconds * 1000).toString().split(' ').splice(1 , 4).join(' ') }}</small>
                </div>
                <div class="comment-body">
                    <p>{{ reply.message }}</p>
                </div>
            </div>
        </section>
    </div>
    <h1 style="text-align: center" v-else-if="ticketData">You are not allowed to read this ticket</h1>
    <h1 style="text-align: center" v-else>Ticket doesn't exist</h1>
</template>
<style scoped>
    h2 small {
        color: rgb(0, 204, 255);
    }
    .comment-wrapper {
        display: block;
        margin: 1em auto;
        background: #303030;
        max-width: 70ch;
        padding: 1.5em;
        color: white;
        text-decoration: none;
        border-radius: 5px;
    }
    .comment-header {
        display: grid;
        grid-template-columns: 60% 40%;
        align-items: center;
    }
    .comment-header > small {
        font-size: 1.1rem;
        text-align: right;
    }
    .comment-body p {
        font-size: 1.3rem;
        margin-bottom: 2em;
    }
    .reply-form {
        display: grid;
        grid-template-columns: calc(80% - 10px) 20%;
        gap: 10px;
        margin: 1em;
    }
    .reply-form input {
        font-size: 1.3rem;
        padding: 0.75em;
        background-color: #1c1c1c;
        color: white;
        border: none;
    }
    .reply-form button {
        font-size: 1.3rem;
        background: rgb(0, 119, 255);
        color: white;
        border: none;
        border-radius: 10px;
    }
    .ticket {
        display: block;
        background: #303030;
        padding: 1.5em;
        color: white;
        text-decoration: none;
        border-radius: 5px;
    }
    .ticket-footer {
        display: flex;
        align-items: center;
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
    .ticket-footer small {
        font-size: 1.1rem;
    }
    .ticket-footer button {
        font-size: 1.1rem;
        background: #dc3545;
        color: white;
        padding: 0.5em;
        border: none;
    }
</style>