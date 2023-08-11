<script setup>
import useAuth from '@/composables/useAuth';
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import useTickets from '@/composables/useTickets'
const { userData } = useAuth()
const { ticketMessage, makeTicket } = useTickets()
const ticketForm = ref({
    type: '',
    email: '',
    name: '',
    details: ''
})
</script>
<template>
    <section class="help-header">
        <h1>The Chatterbox Support</h1>
        <p class="signed-in-as">
            <img class="pfp" 
            :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${userData?.pfp || 'defaultProfile_u6mqts'}`">
            Signed in as @{{ userData?.username || 'not signed in' }}
        </p>
    </section>
    <section class='help-body' v-if='userData'>
        <form @submit.prevent="makeTicket(userData?.username, ticketForm.type, ticketForm.email, ticketForm.name, ticketForm.details)">
            <fieldset>
                <legend>Create a ticket</legend>
                <p v-if="ticketMessage">{{ ticketMessage }}</p>
                <div class="form-group">
                    <label for="type">Type:</label>
                    <select id="type" required v-model="ticketForm.type">
                        <option disabled selected value="">Please Select One</option>
                        <option>Help/Support</option>
                        <option>Trust and Safety</option>
                        <option v-if="!userData?.verified">Verification request</option>
                        <option>Bug report</option>
                        <option>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" placeholder="johnsmith@example.com" v-model="ticketForm.email" required>
                </div>
                <div class="form-group" v-if="ticketForm.type !== 'Verification request'">
                    <label for="name">Name:</label>
                    <input type="text" id="name" placeholder="John Smith" v-model="ticketForm.name" required>
                </div>
                <div class="form-group" v-if="ticketForm.type !== 'Verification request'">
                    <label for="details">Details:</label>
                    <textarea id="details" rows="3" placeholder="johnsmith@example.com" v-model="ticketForm.details" required></textarea>
                </div>
                <button type="submit">Submit</button>
                <div class="display-none" v-if="ticketForm.type === 'Verification request' && ticketForm.details !== ''">
                    {{ ticketForm.details = '' }}
                </div>
            </fieldset>
        </form>
        <div class="help-links">
            <RouterLink class="help-link" to="/admin" v-if="userData?.admin">Admin dashboard</RouterLink>
            <RouterLink class="help-link" to="/your-tickets">See your tickets</RouterLink>
            <a class="help-link" href="mailto:officialthechatterbox@gmail.com" target='_blank'>Email us</a>
        </div>
    </section>
    <h2 v-else>Please sign in</h2>
</template>
<style scoped>
    .help-links {
        text-align: center;
    }
    .help-link {
        background: #17a2b8;
        color: white;
        padding: 1em;
        font-size: 1.5rem;
        text-decoration: none;
        border-radius: 10px;
        display: block;
        margin: 1em 2em;
    }
    select {
        font-size: 1.1rem;
        cursor: pointer;
    }
    input, textarea {
        font-size: 1.1rem;
        width: 70%;
    }
    textarea {
        padding: 0.5em;
    }
    legend {
        font-size: 1.5rem;
        font-weight: bold;
    }
    option[disabled] {
        display: none;
    }
    .pfp {
        margin-right: 0.5em;
        width: 50px;
        height: 50px;
    }
    .signed-in-as {
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: right;
    }
    h1 {
        font-size: 2rem;
    }
    .help-header {
        margin: 0.5em 1em;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    h2 {
        text-align: center;
        font-size: 2.5rem;
    }
    .help-body {
        gap: 0.5em;
        margin: 0.5em;
    }
    @media only screen and (min-width: 800px) {
        .help-body {
            display: grid;
            grid-template-columns: 60% 40%;
        }
    }
    button[type='submit'] {
        background: none;
        border: 1px rgb(3, 149, 3) solid;
        color: rgb(3, 149, 3);
        font-size: 1.3rem;
        border-radius: 5px;
        margin-left: 0.5em;
        padding: 0.5em;
        transition: 100ms;
    }
    button[type='submit']:hover {
        background: rgb(3, 149, 3);
        color: white;
    }
</style>