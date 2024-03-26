import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { createRouter, createWebHistory } from 'vue-router'

import { type IUser } from '@/database/database'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/sign-in',
      name: 'sign',
      component: () => import('@/views/sign/SignView.vue')
    },
    {
      path: '/client',
      name: 'client',
      component: () => import('@/views/client/ClientView.vue')
    },
    {
      path: '/dashboard',
      component: () => import('@/views/SignedWrapper.vue'),
      meta: {
        requiresAuth: true
      },
      beforeEnter: (to, from, next) => {
        const user = useLocalStorage<IUser>('user', null, { serializer: StorageSerializers.object })
        if (user.value === null) next('/sign-in')
        if (user.value.role !== 'admin') next('/user')
        else next()
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue')
        },
        {
          path: 'devices',
          name: 'devices',
          component: () => import('@/views/dashboard/device/DeviceView.vue')
        },
        {
          path: 'device/:id',
          name: 'device-update',
          component: () => import('@/views/dashboard/device/ModifyView.vue')
        },
        // student
        {
          path: 'students',
          name: 'students',
          component: () => import('@/views/dashboard/student/StudentsView.vue')
        },
        {
          path: 'student/:id',
          name: 'student-modify',
          component: () => import('@/views/dashboard/student/ModifyView.vue')
        }
      ]
    },
    {
      path: '/user',
      component: () => import('@/views/SignedWrapper.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'profile',
          component: () => import('@/views/user/ProfileView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import ('@/views/user/settings/SettingsView.vue')
        }
      ]
    },
    { path: '/:pathMatch(.*)*', name: '404', component: () => import('@/views/OopsError.vue') }
  ]
})

export default router
