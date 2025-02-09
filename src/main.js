import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createHead } from '@unhead/vue'

const head = createHead()

const app = createApp(App)

app.use(router)

app.use(head)

app.mount('#app')
