<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { computed, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import NotificationWrapper from '@/components/common/NotificationWrapper.vue'
import { type IClient, User } from '@/database/database'
import { auth, db } from '@/shared/firebase'
import { useDarkModeStore } from '@/stores/darkMode'
import { useUserStore } from '@/stores/user'
import { useUUIDStore } from '@/stores/uuid'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { uuid } = useUUIDStore()
const { setDarkMode, darkMode } = useDarkModeStore()

const loading = ref<boolean>(true)
const isUserAuth = ref<boolean>(false)
const isClient = computed<boolean>(() => route.name === 'client')

onMounted(() => {
  setDarkMode(darkMode)

  onAuthStateChanged(auth, async (data) => {
    if (data) {
      User.read(data.uid).then((user) => {
        userStore.setUser(user)
        isUserAuth.value = true
      })
    } else {
      isUserAuth.value = false
      userStore.setUser(null)
    }
  })
  onSnapshot(doc(db, 'clients', uuid), async (snapshot) => {
    const data = snapshot.data() as IClient
    if (snapshot.exists()) {
      if (loading.value) {
        if (
          (data.status === 'online' && !isClient.value) ||
          (data.status === 'offline' && isClient.value)
        ) {
          loading.value = false
        }
      }
    }
  })

  watch(loading, async (v) => {
    if (!v) {
      if (!isClient.value) {
        if (!isUserAuth.value) await router.push('/client')
        loading.value = true
      } else {
        await router.push('/sign-in')
        loading.value = true
      }
    }
  })
})
</script>

<template>
  <router-view />
  <notification-wrapper />
</template>
