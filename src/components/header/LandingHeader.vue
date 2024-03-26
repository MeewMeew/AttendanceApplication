<script setup lang="ts">
import { computed } from 'vue'

import IconApp from '@/components/icons/IconApp.vue'
import DarkModeSwitcher from '@/components/switchers/DarkModeSwitcher.vue'
import { appname } from '@/shared/constants'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  simple?: boolean
}>()

const userStore = useUserStore()
const isSignedIn = computed(() => userStore.user !== null)
const routerTo = computed(() => (isSignedIn.value ? '/user' : '/sign-in'))
const toMessage = computed(() => (isSignedIn.value ? 'Dashboard' : 'Sign In'))
</script>

<template>
  <header
    class="shadow-xs flex min-w-[400px] flex-wrap items-center bg-white px-4 py-1 shadow-[#ffffff] dark:bg-boxdark lg:px-16"
  >
    <div class="flex flex-1 items-center">
      <router-link to="/" class="flex items-center justify-center space-x-2">
        <icon-app class="h-6 w-6" />
        <span
          class="text-xl font-semibold transition-colors duration-150 ease-linear dark:text-white"
          >{{ appname }}</span
        >
      </router-link>
    </div>

    <dark-mode-switcher />

    <div v-if="!props.simple">
      <router-link
        :to="routerTo"
        class="ml-2 flex flex-1 items-center justify-center rounded-md bg-blue-500 px-8 py-2 text-white hover:bg-blue-600 md:ml-4"
      >
        {{ toMessage }}
      </router-link>
    </div>
  </header>
</template>
