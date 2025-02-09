<script setup>
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'
import { Head } from '@unhead/vue/components'
const { errorMessage, changePassword, changeEmail, userData, deleteAccount, notifsNumber } = useAuth()

const formData = ref({
    email: '',
    oldPassword: '',
    newPassword: '',
    password: ''
})

function confirmIfDelete(username) {
    const yesOrNo = confirm("Are you sure you want to DELETE your account? This action is IRREVERSIBLE!")
    if (yesOrNo) {
        deleteAccount(formData.value.password, username)
    } else {
        console.log('ok, will not delete')
    }
}
</script>
<template>
    <Head>
        <title>{{ (notifsNumber > 0) ? (`(${notifsNumber}) `) : ('') }}Settings - TCB</title>
    </Head>
    <div class="help-links" v-if="userData">
        <button class="help-link" to="/settings/email"
        onclick="document.getElementById('changeEmail').showModal()">Change Email</button>
        <button class="help-link" to="/settings/password"
        onclick="document.getElementById('changePass').showModal()">Change Password</button>
        <button class="help-link" to="/settings/delete"
        onclick="document.getElementById('deleteAccount').showModal()">Delete Account</button>
    </div>
    <dialog id="changeEmail" v-if="userData">
        <p>{{ errorMessage }}</p>
        <div class='modal-header'>
            <h2>Change Email</h2>
            <button class='close-modal' onclick="document.getElementById('changeEmail').close()">&times;</button>
        </div>
        <form class="epic-form" @submit.prevent="changeEmail(formData.email)">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="formData.email" placeholder='Email' required>
            </div>
            <button type='submit' class="login-signup">Change email</button>
        </form>
    </dialog>
    
    <dialog id="changePass" v-if="userData">
        <p>{{ errorMessage }}</p>
        <div class='modal-header'>
            <h2>Change password</h2>
            <button class='close-modal' onclick="document.getElementById('changePass').close()">&times;</button>
        </div>
        <form class="epic-form" @submit.prevent="changePassword(formData.oldPassword, formData.newPassword)">
            <div class="form-group">
                <label for="oldPass">Old password</label>
                <input type="password" id="oldPass" v-model="formData.oldPassword" placeholder='Old Password' required>
            </div>
            <div class="form-group">
                <label for="newPass">New password</label>
                <input type="password" id="newPass" v-model="formData.newPassword" placeholder='New Password' required>
            </div>
            <button type='submit' class="login-signup">Change password</button>
        </form>
    </dialog>

    <dialog id="deleteAccount" v-if='userData'>
        <p>{{ errorMessage }}</p>
        <div class="warning">
            <h2>DELETING YOUR ACCOUNT IS IRREVERSIBLE!</h2>
        </div>
        <div class='modal-header'>
            <h2>Delete Account</h2>
            <button class='close-modal' onclick="document.getElementById('deleteAccount').close()">&times;</button>
        </div>
        <form class="epic-form" @submit.prevent="confirmIfDelete(userData.username)">
            <div class="form-group">
                <label for="pass">Password</label>
                <input type="password" id="pass" v-model="formData.password" placeholder='Password' required>
            </div>
            <button type='submit' class="login-signup delete">Delete Account</button>
        </form>
    </dialog>
</template>
<style scoped>
.help-links {
    text-align: center;
}
.help-link {
    border: none;
    background: #17a2b8;
    color: white;
    padding: 1em;
    font-size: 1.5rem;
    text-decoration: none;
    border-radius: 10px;
    display: block;
    margin: 1em 2em;
}
button.help-link {
    display: block;
    width: calc(100% - 4em);
}
.delete {
    color: red;
    border: red solid 1px;
}
.delete:hover, .delete:focus {
    background: red;
    color: white;
}
.warning {
    color: white;
    padding: 0.5em;
    background: rgb(215, 2, 2);
}
</style>