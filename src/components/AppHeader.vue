<script setup>
import { RouterLink } from 'vue-router'
import useAuth from "@/composables/useAuth";
import usePosts from '@/composables/usePosts'
import { ref } from "vue";
const { signUp, errorMessage, login, logOut, userData } = useAuth()
const { makePost, postMessage } = usePosts()
const formData = ref({
    email: '',
    password: '',
    username: ''
})
const postFormData = ref('')
</script>
<template>
    <header>
        <nav>
            <img src="../assets/images/logo.png" alt="TCB Vue">
            <RouterLink to="/" class="nav-link"><i class="fas fa-home"></i></RouterLink>
            <RouterLink :to='`/@${userData?.username}`' class="nav-link"><i class='fas fa-user'></i></RouterLink>
            <button onclick='document.getElementById("postModal").showModal()' class="nav-link logout"><i class='fas fa-plus-circle'></i></button>
            <RouterLink to="/about" class="nav-link"><i class='fas fa-info-circle'></i></RouterLink>
            <button class='login' onclick='document.getElementById("signInModal").showModal()' v-if="userData == null">Login</button>
            <button class="nav-link logout" v-else @click="logOut()"><i class="fas fa-sign-out-alt"></i></button>
        </nav>

        <dialog id="postModal" v-if='userData'>
            <p v-if="postMessage">{{ postMessage }}</p>
            <div class='modal-header'>
                <h2>Create post</h2>
                <button class='close-modal' onclick="document.getElementById('postModal').close()">&times;</button>
            </div>
            <form class="sign-in-form">
                <div class="form-group">
                    <label for="message">Message:</label>
                    <textarea id="message" v-model="postFormData" placeholder='Whats up?'></textarea>
                </div>
                <button type='button' @click.prevent="makePost(postFormData, userData.username); postFormData = ''" onclick="document.getElementById('postModal').close()" class='login-signup'>Post</button>
            </form>
        </dialog>
        
        <dialog id="signUpModal" v-if='userData === null'>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <div class='modal-header'>
                <h2>Sign up</h2>
                <button class='close-modal' onclick="document.getElementById('signUpModal').close()">&times;</button>
            </div>
            <form class="sign-in-form">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="formData.email" placeholder='Email'>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" v-model="formData.password" placeholder='Password'>
                </div>
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" v-model="formData.username" placeholder='Username' maxlength="25" pattern="[a-z0-9_]{2,}">
                </div>
                <small><b>By making an account, I agree and will follow the <a href='/tos' target="_blank">terms of service</a></b></small><br>
                <button type='button' @click.prevent="signUp(formData.email, formData.password, formData.username)" class='login-signup'>Sign up</button>
            </form>
        </dialog>

        <dialog id="signInModal" v-if='userData === null'>
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <button onclick="document.getElementById('signInModal').close(); document.getElementById('signUpModal').showModal()" class="already-have-account">Don't have an account? Sign up!</button>
            <div class='modal-header'>
                <h2>Login</h2>
                <button class='close-modal' onclick="document.getElementById('signInModal').close()">&times;</button>
            </div>
            <form class="sign-in-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="formData.email" placeholder='Email'>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="formData.password" placeholder='Password'>
                </div>
                <button type='button' @click.prevent="login(formData.email, formData.password)" class="login-signup">Login</button>
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
    .login-signup {
        font-size: 1.3rem;
        background: none;
        border: 1px solid green;
        color: green;
        margin-inline: 0.3em;
        padding: 0.5em;
        border-radius: 5px;
        cursor: pointer;
        transition: 300ms;
    }
    .login-signup:hover, .login-signup:focus {
        background: green;
        color: white;
    }
</style>