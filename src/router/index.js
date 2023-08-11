import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
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
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/post/:post',
      name: 'post',
      component: () => import('../views/PostView.vue')
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
