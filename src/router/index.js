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
      name: 'The Chatterbox Vue',
      component: Home
    },
    {
      path: '/about',
      name: 'About - TCBV',
      component: About
    },
    {
      path: '/tos',
      name: 'Terms of Service - TCBV',
      component: () => import('../views/TOS.vue')
    },
    {
      path: '/privacy',
      name: 'Privacy - TCBV',
      component: () => import('../views/Privacy.vue')
    },
    {
      path: '/@:username',
      name: 'user',
      component: Profile
    },
    {
      path: '/@:username/comments',
      name: 'comments',
      component: Profile
    },
    {
      path: '/@:username/likes',
      name: 'likes',
      component: Profile
    },
    {
      path: '/post/:post',
      name: 'Post on TCBV',
      component: Post
    },
    {
      path: '/saves',
      name: 'Your saves - TCBV',
      component: () => import('../views/SavesView.vue')
    },
    {
      path: '/help',
      name: 'Help - TCBV',
      component: () => import('../views/HelpView.vue')
    },
    {
      path: '/your-tickets',
      name: 'Your Tickets - TCBV',
      component: () => import('../views/YourTickets.vue')
    },
    {
      path: '/ticket/:ticket',
      name: 'Ticket on TCBV',
      component: () => import('../views/TicketView.vue')
    },
    {
      path: '/admin',
      name: 'Admin Dashboard - TCBV',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/:pathName(.*)',
      name: '404!',
      component: () => import('../views/PageNotFound.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.params?.username) {
    if (to.name === 'likes') {
      document.title = `@${to.params.username}'s likes on TCBV`
    } else if (to.name === 'comments') {
      document.title = `@${to.params.username}'s comments on TCBV`
    } else {
      document.title = `@${to.params.username} on TCBV`
    }
    next()
  } else {
    document.title = to.name
    next()
  }
});

export default router
