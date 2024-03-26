import './assets/main.css'
import '@/services/registerSW'

import { onAuthStateChanged } from 'firebase/auth'
import  notiwind  from 'notiwind'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager , defaultConfig } from 'vue-meta'

import { registerSW } from '@/services/registerSW'
import { auth } from '@/shared/firebase'

import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)
const metaManager = createMetaManager(false, defaultConfig)

registerSW()

app.use(notiwind)
app.use(pinia)
app.use(router)
app.use(metaManager)

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const unsubscribe = onAuthStateChanged(auth, async(user) => {
    unsubscribe()
    if (requiresAuth && !user) next('/sign-in')
    else next()
  })

})

app.mount('#app')
