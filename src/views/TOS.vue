<script setup>import { RouterLink } from 'vue-router'</script>
<template>
    <div id="main-content">
        <h1>Terms of Service for The Chatterbox Vue</h1>
        <b>BY JOINING THE CHATTERBOX VUE, YOU HAVE READ, AGREED TO, AND WILL FOLLOW THE FOLLOWING.</b>
        <br>
        <div class="code-of-conduct">
            <h2>Code of Conduct </h2>
            <p>The Code of Conduct for The Chatterbox Vue is as follows</p>
            <ul>
                <li>No cyberbullying </li>
                <li>No promotion/selling/encouragement of illegal activities/goods</li>
                <li>No leaking of personal information / No doxxing</li>
            </ul>
            <h3>No bullying </h3>
            <p>Mild bullying, like teasing is okay. However, severe bullying, as in danger to one's mental health, will get one removed from the platform.</p>
            
            <h3>No promotion/selling/encouragement of illegal activities/goods</h3>
            <p>Any promotion, selling, encouragement, or anything that can cause a user to do or buy something illegal will be removed immediately upon finding.</p>
            
            <h3>No leaking of personal information / No doxxing</h3>
            <p>Any leaking of personal information of any user or any person without their consent is strictly not allowed. You will be removed off the platform if caught.</p>
        </div>
        <br>
        <div class="terms-of-service">
            <h2>Other terms of service</h2>
            <p>Other terms of service you must follow</p>
            <ul>
                <li>No impersonation of other users to trick/deceive</li>
                <li>All users must be at least 13 years of age</li>
                <li>Admins have the right to remove all content they may deem hurtful or against the terms of service.</li>
            </ul>
            <h3>No impersonation of other users to trick/deceive</h3>
            <p>Impersonation to trick/deceive users is strictly not allowed. If you are caught doing this, your account will be deleted. If you are a parody account, you must have "parody" somewhere in your bio.</p>
            
            <h3>All users must be at least 13 years of age</h3>
            <p>To comply with the Children's Online Privacy Protection Act (COPPA), all users must be at least 13 years of age.</p>
            
            <h3>Admins have the right to remove all content they may deem hurtful or against the terms of service.</h3>
            <p>All admins may remove any and all content they need to remove. Admins are trusted to do their job properly.</p>
        </div>
        <br>
        <div class="copyright">
            <h2>Copyright</h2>
            <p>The copyright rules of The Chatterbox Vue</p>
            <h3>The Chatterbox Vue is an open-source project protected by an MIT License. The full copyright license is shown below.</h3>
            <code>MIT License <br>
                <span>Copyright (c) 2023 Chibs Incorporated and Shedeur Bhatkal</span>
                <br>
                <br>
                <span>Permission is hereby granted, free of charge, to any person obtaining a copy</span>
                <br>
                <span>of this software and associated documentation files (the "Software"), to deal</span>
                <br>
                <span>in the Software without restriction, including without limitation the rights</span>
                <br>
                <span>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell</span>
                <br>
                <span>copies of the Software, and to permit persons to whom the Software is</span>
                <br>
                <span>furnished to do so, subject to the following conditions:</span>
                <br>
                <br>
                <span>The above copyright notice and this permission notice shall be included in all</span>
                <br>
                <span>copies or substantial portions of the Software.</span>
                <br>
                <br>
                <span>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR</span>
                <br>
                <span>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,</span>
                <br>
                <span>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE</span>
                <br>
                <span>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER</span>
                <br>
                <span>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,</span>
                <br>
                <span>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE</span>
                <br>
                <span>SOFTWARE.</span>
            </code>
            <h3>Our logo</h3>
            <p>Our logo is copyrighted by @tash.draws on Instagram. The Chatterbox Social Media has permission to use it. The copyright holder has the right to take down anything that uses the logo without their permission.</p>
        </div>
        <br>
        <div class="data">
            <h2>Data protection </h2>
            <b>DATA THE CHATTERBOX VUE COLLECTS ABOUT YOU:</b>
            <ul>
                <li>User information (encrypted password, email, username, etc.)</li>
                <li>People you follow </li>
                <li>That's all.</li>
            </ul>
            <h3>Why we don't collect data </h3>
            <p>We don't collect any data, besides important ones from you, due to the fact that we don't know how</p>
            
            <h3>Your email and what we do with it </h3>
            <p>Your email is not used by us EXCEPT for contacting. Example, if you break rules, we will contact you by email.</p>
            <h3>For more info on you privacy, visit our <RouterLink to="/privacy">privacy policy</RouterLink></h3>
        </div>
        <br>
        <b>ANY AND ALL INCIDENTS WHERE THE TERMS OF SERVICE ABOVE ARE BROKEN MAY RESULT IN YOUR CONTENT ON THE PLATFORM BEING PERMANENTLY DELETED.</b>
        <br>
        <br>
        <b>WE RESERVE THE RIGHT TO CHANGE THESE TERMS OF SERVICE ANYTIME WE WISH. WE WILL NOTIFY YOU IF SUCH EVENT HAPPENS</b>
    </div>
</template>
<style scoped>
#main-content {
    padding: 2em;
}
p {
    font-size: 1.2rem;
}
code {
    font-size: 1.2rem;
}
</style>