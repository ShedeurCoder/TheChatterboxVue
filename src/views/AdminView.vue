<script setup>
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'
import useAdmin from '@/composables/useAdmin'
import TicketComponent from '@/components/TicketComponent.vue'

const { userData } = useAuth()
const { tickets, closedTickets, verifyRequests, verify, rejectVerify, addAdmin, removeAdmin, unverify } = useAdmin()

const addAdminInput = ref('')
const removeAdminInput = ref('')
const unverifyInput = ref('')
</script>
<template>
    <h1>Admin dashboard</h1>
    <div class="admin" v-if="userData?.admin">
        <div class="tickets">
            <section class="verify-requests">
                <details>
                    <summary><h2>Verification requests&nbsp; ({{ verifyRequests.length }})</h2></summary>
                    <div v-for="ticket in verifyRequests" :ticket="ticket" class="verify">
                        <h2>@{{ ticket.username }}</h2>
                        <button @click="verify(ticket.username, ticket.id)"><i class='fas fa-check' style="color: green;"></i></button>
                        <button @click="rejectVerify(ticket.id)"><i class='fas fa-times' style="color: red;"></i></button>
                    </div>
                </details>
            </section>
            <section class="open-tickets">
                <details open>
                    <summary><h2>Open tickets</h2></summary>
                    <details>
                        <summary><h3>Help/Support&nbsp; ({{ tickets.filter((ticket) => ticket.type === 'Help/Support').length }})</h3></summary>
                        <TicketComponent v-for="ticket in tickets.filter((ticket) => ticket.type === 'Help/Support')"
                        :key="ticket.id" :ticket="ticket" class="ticket"/>
                    </details>
                    <hr>
                    <details>
                        <summary><h3>Trust and Safety&nbsp; ({{ tickets.filter((ticket) => ticket.type === 'Trust and Safety').length }})</h3></summary>
                        <TicketComponent v-for="ticket in tickets.filter((ticket) => ticket.type === 'Trust and Safety')"
                        :key="ticket.id" :ticket="ticket" class="ticket"/>
                    </details>
                    <hr>
                    <details>
                        <summary><h3>Bug report&nbsp; ({{ tickets.filter((ticket) => ticket.type === 'Bug report').length }})</h3></summary>
                        <TicketComponent v-for="ticket in tickets.filter((ticket) => ticket.type === 'Bug report')"
                        :key="ticket.id" :ticket="ticket" class="ticket"/>
                    </details>
                    <hr>
                    <details>
                        <summary><h3>Other&nbsp; ({{ tickets.filter((ticket) => ticket.type === 'Other').length }})</h3></summary>
                        <TicketComponent v-for="ticket in tickets.filter((ticket) => ticket.type === 'Other')"
                            :key="ticket.id" :ticket="ticket" class="ticket"/>
                    </details>
                </details>
            </section>
            <section class="closed-tickets">
                <details>
                    <summary><h2>Closed tickets</h2></summary>
                    <TicketComponent v-for="ticket in closedTickets" :key="ticket.id" :ticket="ticket"/>
                </details>
            </section>
        </div>

        <section class="owner" v-if="userData?.owner">
            <br>
            <hr>
            <h2>Unverify a user</h2>
            <div class='form-group'>
                <input type='text' placeholder='username' v-model='unverifyInput'>
                <button type="button" class="unverify-button" @click="unverify(unverifyInput)">Unverify</button>
            </div>
            <hr>
            <h2>Add an admin</h2>
            <div class='form-group'>
                <input type='text' placeholder='username' v-model='addAdminInput'>
                <button type="button" class="unverify-button" @click="addAdmin(addAdminInput)">Add admin</button>
            </div>
            <hr>
            <h2>Remove an admin</h2>
            <div class='form-group'>
                <input type='text' placeholder='username' v-model='removeAdminInput'>
                <button type="button" class="unverify-button" @click="removeAdmin(removeAdminInput)">Remove admin</button>
            </div>
        </section>
    </div>
    <h2 v-else>You are not an admin. Go back <a href='/'>home</a></h2>
</template>
<style scoped>
.form-group {
    text-align: center;
}
input {
    display: inline-block;
    width: 70%;
}
.unverify-button {
    background: #dc3545;
    color: white;
    display: inline-block;
    padding: 0.5em;
    font-size: 1.1rem;
    border-radius: 5px;
    margin-left: 0.5em;
}
details details summary {
    text-align: right;
    margin-right: 1em;
}
details details summary h3 {
    display: inline;
}
details details summary::marker {
    content: initial;
    display: inline;
}
.ticket {
    font-size: 70%;
}
.open-tickets {
    grid-row: span 2;
}
.tickets {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 0.5em;
}
section {
    height: 100%;
}
button {
    background: none;
    border: none;
    font-size: 1.3rem;
    text-align: center;
}
.verify {
    background: black;
    display: grid;
    max-width: 80ch;
    width: 70%;
    grid-template-columns: 80% 10% 10%;
    align-items: center;
    margin: 1em auto;
    padding: 1em;
}
.verify h2 {
    display: inline;
    text-align: left;
}
h1, h2 {
    text-align: center;
}
summary {
    cursor: pointer;
    user-select: none;
}
summary::marker {
    content: ''
}
details summary h2::before {
    content: '+';
    margin-right: 0.5em;
}
details[open] summary h2::before {
    content: '×';
}
</style>