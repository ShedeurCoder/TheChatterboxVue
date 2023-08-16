import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import Profile from '../views/ProfileView.vue'
import Post from '../views/PostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/tos',
      name: 'tos',
      component: () => import('../views/TOS.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/Privacy.vue')
    },
    {
      path: '/@:username',
      name: 'user',
      component: Profile
    },
    {
      path: '/post/:post',
      name: 'post',
      component: Post
    },
    {
      path: '/saves',
      name: 'saves',
      component: () => import('../views/SavesView.vue')
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue')
    },
    {
      path: '/your-tickets',
      name: 'your-tickets',
      component: () => import('../views/YourTickets.vue')
    },
    {
      path: '/ticket/:ticket',
      name: 'ticket-page',
      component: () => import('../views/TicketView.vue')
    },
    {
      path: '/admin',
      name: 'adminLink',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/:pathName(.*)',
      name: 'notFound',
      component: () => import('../views/PageNotFound.vue')
    }
  ]
})

export default router
