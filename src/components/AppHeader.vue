<script setup>
import { RouterLink } from 'vue-router'
import useAuth from "@/composables/useAuth";
import { ref } from "vue";
import useRandom from '@/composables/useRandom'
const { styleDate } = useRandom()
const { signUp, errorMessage, login, logOut, userData, readNotifs, unreadNotifs, readNotif, deleteNotif } = useAuth()
const formData = ref({
    email: '',
    password: '',
    username: ''
})
</script>
<template>
    <header>
        <nav>
            <img src="../assets/images/logo.png" alt="TCB Vue">

            <RouterLink to="/" class="nav-link"><i class="fas fa-home"></i></RouterLink>
            
            <button onclick='document.getElementById("notifsModal").showModal()' class="nav-link logout notifs">
                <i class='fas fa-bell'></i>
                <span class="notif-length" v-if="unreadNotifs.length > 0">{{ unreadNotifs.length }}</span>
            </button>

            <RouterLink :to='`/@${userData?.username}`' class="nav-link"><i class='fas fa-user'></i></RouterLink>
            
            <RouterLink to='/saves' class="nav-link"><i class='fas fa-bookmark'></i></RouterLink>

            <RouterLink to="/help" class="nav-link"><i class='fas fa-question-circle'></i></RouterLink>

            <button class='login' 
            onclick='document.getElementById("signInModal").showModal()' v-if="userData == null">Login</button>

            <button class="nav-link logout" v-else @click="logOut()">
                <i class="fas fa-sign-out-alt"></i>
            </button>
            
            <RouterLink v-if='userData' class="nav-link nav-pfp" :to="`/@${userData.username}`">
                <img class='pfp' 
                :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${userData?.pfp || 'defaultProfile_u6mqts'}`">
            </RouterLink>
        </nav>

        <dialog id="notifsModal">
            <div class='modal-header'>
                <h2>Notifications</h2>
                <button class='close-modal' onclick="document.getElementById('notifsModal').close()">&times;</button>
            </div>
            <hr>
            <div class="notifs-container" v-if="unreadNotifs">
                <div v-for="notif in unreadNotifs" class="notif">
                    <RouterLink :to="notif.url" class="notif-link"
                    onclick="document.getElementById('notifsModal').close()" @click='readNotif(notif.id)'>
                        <p class="notif-date">{{ styleDate(notif.createdAt) }}</p>
                        <p class="notif-message">{{ notif.message }}</p>
                    </RouterLink>
                    <button @click='deleteNotif(notif.id)'><i class='fas fa-trash'></i></button>
                </div>
            </div>
            <h3 v-else>You're all caught up!</h3>
            <hr v-if="readNotifs.length > 0 && unreadNotifs.length > 0">
            <h3 v-if="readNotifs.length > 0">Read notifications</h3>
            <div class="notifs-container">
                <div v-for="notif in readNotifs" class="notif">
                    <RouterLink :to="notif.url" class="notif-link"
                    onclick="document.getElementById('notifsModal').close()">
                        <p class="notif-date">{{ styleDate(notif.createdAt) }}</p>
                        <p class="notif-message">{{ notif.message }}</p>
                    </RouterLink>
                    <button @click='deleteNotif(notif.id)'><i class='fas fa-trash'></i></button>
                </div>
            </div>
        </dialog>
        
        <dialog id="signUpModal" v-if='userData === null'>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <div class='modal-header'>
                <h2>Sign up</h2>
                <button class='close-modal' onclick="document.getElementById('signUpModal').close()">&times;</button>
            </div>
            <form class="sign-in-form" @submit.prevent="signUp(formData.email, formData.password, formData.username)">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="formData.email" placeholder='Email' required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" v-model="formData.password" 
                    placeholder='Password' required minlength="6">
                </div>
                <div class="form-group">
                    <label for="username">Username: (a-z, 0-9, and underscores only)</label>
                    <input type="text" id="username" v-model="formData.username" 
                    placeholder='Username' required maxlength="20" pattern="[a-z0-9_]{2,}">
                </div>
                <small><b>By making an account, I agree and will follow the 
                    <a href='/tos' target="_blank">terms of service</a>
                </b></small><br>
                <button type='submit' class='login-signup'>Sign up</button>
            </form>
        </dialog>

        <dialog id="signInModal" v-if='userData === null'>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <button 
            onclick="document.getElementById('signInModal').close(); 
            document.getElementById('signUpModal').showModal()" class="already-have-account">
                Don't have an account? Sign up!
            </button>
            <div class='modal-header'>
                <h2>Login</h2>
                <button class='close-modal' onclick="document.getElementById('signInModal').close()">&times;</button>
            </div>
            <form class="sign-in-form" @submit.prevent="login(formData.email, formData.password)">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="formData.email" placeholder='Email' required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="formData.password" 
                    placeholder='Password' required minlength="6">
                </div>
                <button type='submit' class="login-signup">Login</button>
            </form>
        </dialog>
    </header>
</template>

<style scoped>
    .login {
        background: rgb(3, 105, 136);
        border: none;
        color: white;
        font-size: 1.5rem;
        padding: 0.75em;
        border-radius: 20px;
        cursor: pointer;
    }
    .logout {
        background: none;
        border: none;
        cursor: pointer;
    }
    .already-have-account {
        background: none;
        color: rgb(0, 106, 255);
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }
    .pfp {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        object-fit: cover;
    }
    .nav-pfp {
        display: none;
    }
    @media only screen and (min-width: 800px) {
        .nav-pfp {
            display: inline;
        }
    }
    .nav-pfp {
        margin-top: 20px;
    }
    .notifs {
        position: relative;
        padding-inline: 0.5em;
    }
    .notif-length {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        background: red;
        font-size: 1rem;
        color: white;
    }
    #notifsModal h3 {
        text-align: center;
        font-size: 2rem;
    }
    .notif {
        background: black;
        display: block;
        padding: 1em;
        margin-block: 1em;
    }
    .notif-link {
        color: white;
        text-decoration: none;
    }
    .notif-date {
        float: right;
    }
    .notif-message {
        font-size: 1.3rem;
    }
    .notif button {
        background: none;
        border: none;
        font-size: 1.3rem;
        color: white;
    }
    .notif button:hover {
        color: red;
    }
</style>