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
      name: 'The Chatterbox',
      component: Home
    },
    {
      path: '/explore',
      name: 'Explore - TCB',
      component: () => import('../views/Explore.vue')
    },
    {
      path: '/search',
      name: 'Search - TCB',
      component: () => import('../views/SearchResults.vue')
    },
    {
      path: '/about',
      name: 'About - TCB',
      component: About
    },
    {
      path: '/tos',
      name: 'Terms of Service - TCB',
      component: () => import('../views/TOS.vue')
    },
    {
      path: '/privacy',
      name: 'Privacy - TCB',
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
      name: 'Post on TCB',
      component: Post
    },
    {
      path: '/saves',
      name: 'Your saves - TCB',
      component: () => import('../views/SavesView.vue')
    },
    {
      path: '/help',
      name: 'Help - TCB',
      component: () => import('../views/HelpView.vue')
    },
    {
      path: '/settings',
      name: 'Settings - TCB',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/your-tickets',
      name: 'Your Tickets - TCB',
      component: () => import('../views/YourTickets.vue')
    },
    {
      path: '/ticket/:ticket',
      name: 'Ticket on TCB',
      component: () => import('../views/TicketView.vue')
    },
    {
      path: '/admin',
      name: 'Admin Dashboard - TCB',
      component: () => import('../views/AdminView.vue')
    },

    // CHAT ROUTES
    {
      path: '/chat',
      name: 'The Chatterbox Chat',
      component: () => import('../views/Chat.vue')
    },
    {
      path: '/chat/:chatId',
      name: 'Chat on TCBV',
      component: () => import('../views/ChatPage.vue')
    },

    // TCB LINK ROUTES
    {
      path: '/link',
      name: 'The Chatterbox Tree',
      component: () => import('../views/TCBLinkVue.vue')
    },
    {
      path: '/t/:user',
      name: 'The Chatterbox Tree Profile',
      component: () => import('../views/TCBLinkUser.vue')
    },

    // 404
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
