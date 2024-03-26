<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { signOut } from 'firebase/auth'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import DropdownUserItem from '@/components/header/DropdownUserItem.vue'
import IconComponent from '@/components/icons/IconComponent.vue'
import * as utils from '@/libs/utils'
import { auth } from '@/shared/firebase'
import { useDarkModeStore } from '@/stores/darkMode'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const darkModeStore = useDarkModeStore()

const target = ref(null)
const dropdownOpen = ref(false)
const acronym = computed(() => {
  const name = userStore.user?.displayName || userStore.user?.email || ''
  return utils.getAcronym(name)
})
const themeMode = computed(() => (darkModeStore.darkMode ? 'Light Mode' : 'Dark Mode'))
const userAvatar = computed(() => userStore.user?.photoURL || '')
const userClassName = computed(() => userStore.user?.class || 'No Class')
const isuser = computed(() => userStore.user?.role === 'user' || false)
const userName = computed(() => userStore.user?.displayName || userStore.user?.email || 'No Name')

onClickOutside(target, () => (dropdownOpen.value = false))

onMounted(() => userStore.fetch())

const signOutAndRedirect = async () => {
  await router.push('/sign-in')
  await signOut(auth)
}

const items = [
  {
    label: 'My Profile',
    route: '/user',
    icon: 'User'
  },
  {
    label: 'Settings',
    route: '/user/settings',
    icon: 'Settings'
  }
]
</script>

<template>
  <div class="relative transition-colors duration-150 dark:text-whiten" ref="target">
    <div
      class="flex cursor-pointer items-center gap-4"
      @click.prevent="dropdownOpen = !dropdownOpen"
    >
      <span class="hidden text-right lg:block">
        <span class="block text-sm font-bold text-black dark:text-white">{{ userName }}</span>
        <span class="block text-xs font-semibold dark:text-white" v-if="isuser">{{
          userClassName
        }}</span>
      </span>

      <span class="h-12 w-12 rounded-full">
        <img v-if="userAvatar" :src="userAvatar as string" alt="User" class="rounded-full" />
        <span
          v-else
          class="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-xl uppercase text-white"
          >{{ acronym }}</span
        >
      </span>
    </div>

    <div
      v-show="dropdownOpen"
      class="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <ul class="flex flex-col gap-5 border-b border-stroke px-6 py-4 dark:border-strokedark">
        <dropdown-user-item v-for="(item, index) in items" :item="item" :key="index" />
      </ul>
      <button
        @click="darkModeStore.toggleDarkMode()"
        class="flex items-center gap-3.5 px-6 pt-3 text-sm font-normal duration-300 ease-in-out hover:text-primary lg:text-base"
      >
        <icon-component :name="darkModeStore.darkMode ? 'Sun' : 'Moon'" stroke-width="2px" />
        {{ themeMode }}
      </button>
      <button
        class="flex items-center gap-3.5 px-6 py-5 text-sm font-normal duration-300 ease-in-out hover:text-primary lg:text-base"
        @click="signOutAndRedirect"
      >
        <icon-component name="LogOut" stroke-width="2px" />
        Log Out
      </button>
    </div>
  </div>
</template>
