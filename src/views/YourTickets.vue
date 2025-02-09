<script setup>
import useTickets from '@/composables/useTickets'
import useAuth from '@/composables/useAuth'
import TicketComponent from '../components/TicketComponent.vue'
import { Head } from '@unhead/vue/components'
const { userTickets, getUserTickets } = useTickets()
const { userData, notifsNumber } = useAuth()
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}Your Tickets - TCB</title>
    </Head>
    <div class="display-none" v-if="userTickets === null && userData">
        {{ getUserTickets(userData.username) }}
    </div>
    <div v-if="userData && userTickets !== []">
        <TicketComponent v-for="ticket in userTickets" :ticket="ticket" :key="ticket.id"/>
    </div>
    <div v-else-if="userData && userTickets === []">
        <h1 style="text-align: center">You haven't created any tickets yet</h1>
    </div>
    <div v-else>
        <h1 style="text-align: center">Sign in to see your tickets</h1>
    </div>
</template>