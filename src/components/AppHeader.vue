<script setup>
import { RouterLink } from 'vue-router'
import useAuth from "@/composables/useAuth"
import { ref } from "vue";
import useRandom from '@/composables/useRandom'
const { styleDate } = useRandom()
const { signUp, errorMessage, login, logOut, userData, readNotifs, unreadNotifs, readNotif, deleteNotif, chatNotifs, forgor, deleteAllNotifs } = useAuth()
const formData = ref({
    email: '',
    password: '',
    username: ''
})

const more = ref(false)

function toggleMore() {
    more.value = !more.value
}
</script>
<template>
    <header>
        <a href="#main" class="skip-nav">Skip navigation</a>
        <nav>
            <img src="../assets/images/logo.png" alt="TCB Vue">

            <RouterLink to="/" class="nav-link"><i class="fas fa-home"></i></RouterLink>
            
            <button onclick='document.getElementById("notifsModal").showModal()' 
            v-if='userData' class="nav-link logout notifs">
                <i class='fas fa-bell'></i>
                <span class="notif-length" v-if="unreadNotifs.length > 0">{{ unreadNotifs.length }}</span>
            </button>
            
            <RouterLink to="/explore" class="nav-link"><i class='fas fa-compass'></i></RouterLink>
            
            <RouterLink to="/about" class="nav-link" v-if="!userData">
                <i class="fas fa-info-circle"></i>
            </RouterLink>

            <a href="https://twitter.com/chatterbox_off" class="nav-link" v-if='!userData' target="_blank">
                <i class="fab fa-twitter"></i>
            </a>

            <RouterLink :to='`/@${userData?.username}`' class="nav-link" v-if='userData' >
                <i class='fas fa-user'></i>
            </RouterLink>

            <RouterLink to="/chat" class="nav-link notifs" v-if="userData">
                <i class="fas fa-comment-dots"></i>
                <span class="notif-length chat-notif" v-if="chatNotifs.length > 0">{{ chatNotifs.length }}</span>
            </RouterLink>

            <RouterLink to="/link" class="nav-link" v-if="userData">
                <i class="fas fa-link"></i>
            </RouterLink>

            <button class='login' 
            onclick='document.getElementById("signInModal").showModal()' v-if="userData == null">Login</button>

            <button class="nav-link logout" v-else @click="toggleMore()">
                <i class="fas fa-ellipsis-h"></i>
            </button>
            
            <RouterLink v-if='userData' class="nav-link nav-pfp" :to="`/@${userData.username}`">
                <img class='pfp' 
                :src="`https://res.cloudinary.com/dmftho0cx/image/upload/${userData?.pfp || 'defaultProfile_u6mqts'}`">
            </RouterLink>

            <div class="more" v-if="more && userData">
                <RouterLink to='/saves' class="nav-link" @click="toggleMore()">
                    <i class='fas fa-bookmark'> Saves</i>
                </RouterLink>

                <RouterLink to="/help" class="nav-link" @click="toggleMore()">
                    <i class='fas fa-question-circle'> Help</i>
                </RouterLink>
                
                <RouterLink to="/about" class="nav-link" @click="toggleMore()">
                    <i class='fas fa-info-circle'> About</i>
                </RouterLink>

                <RouterLink to="/settings" class="nav-link" @click="toggleMore()">
                    <i class='fas fa-cog'> Settings</i>
                </RouterLink>

                <button class="nav-link logout" @click="logOut(); toggleMore()">
                    <i class="fas fa-sign-out-alt"> Logout</i>
                </button>
            </div>
        </nav>

        <dialog id="notifsModal" v-if="userData">
            <div class='modal-header'>
                <h2>Notifications</h2>
                <button class='close-modal' onclick="document.getElementById('notifsModal').close()">&times;</button>
            </div>
            <hr>
            <div class="deleteNotifs" v-if='unreadNotifs.length || readNotifs.length'>
                <button @click="deleteAllNotifs(userData.username)">Delete all</button>
            </div>
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
                    <label for="emailSU">Email:</label>
                    <input type="email" id="emailSU" v-model="formData.email" placeholder='Email' required>
                </div>
                <div class="form-group">
                    <label for="passwordSU">Password:</label>
                    <input type="password" id="passwordS" v-model="formData.password" 
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
                    <label for="emailLI">Email</label>
                    <input type="email" id="emailLI" v-model="formData.email" placeholder='Email' required>
                </div>
                <div class="form-group">
                    <label for="passwordLI">Password</label>
                    <input type="password" id="passwordLI" v-model="formData.password" 
                    placeholder='Password' required minlength="6">
                </div>
                <button type='submit' class="login-signup">Login</button>
            </form>
            <br>
            <button 
            onclick="document.getElementById('signInModal').close(); 
            document.getElementById('forgotPassword').showModal()" class="already-have-account forgor">
                Forgot password?
            </button>
        </dialog>

        <dialog id="forgotPassword">
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <div class='modal-header'>
                <h2>Password reset</h2>
                <button class='close-modal' onclick="document.getElementById('forgotPassword').close()">&times;</button>
            </div>
            <form class="sign-in-form" @submit.prevent="forgor(formData.email)">
                <div class="form-group">
                    <label for="emailLI">Email</label>
                    <input type="email" id="emailLI" v-model="formData.email" placeholder='Email' required>
                </div>
                <button type='submit' class="login-signup">Send reset email</button>
            </form>
        </dialog>
    </header>
</template>

<style scoped>
    .more {
        position: fixed;
        background: black;
        right: 5%;
        bottom: 10dvh;
        padding: 1em;
        z-index: 105;
    }
    .more .nav-link {
        display: block;
        font-size: 1.3rem;
        margin: 0.5em;
    }
    @media only screen and (min-width: 800px) {
        .more {
            left: 8%;
            bottom: 10%;
            right: initial;
        }
    }
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
    .chat-notif {
        top: -5px;
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
    .forgor {
        font-size: 1.3rem;
    }
    .deleteNotifs button {
        border: none;
        color: white;
        background: #dc3545;
        padding: 0.3em;
    }
</style>