import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import PostView from '../views/PostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      path: '/@:username',
      name: 'user',
      component: ProfileView
    },
    {
      path: '/post/:post',
      name: 'post',
      component: PostView
    },
    {
      path: '/:pathName(.*)',
      name: 'notFound',
      component: () => import('../views/PageNotFound.vue')
    }
  ]
})

export default router
